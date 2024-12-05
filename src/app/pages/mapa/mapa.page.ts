import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from 'src/app/services/firebase/auth.service';
import { ModalController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { BarcodeScanner, LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit, AfterViewInit {
  map: L.Map | undefined;
  currentRoute: L.Polyline | undefined;
  availableSeats: number = 4;
  tripCost: number = 0;
  startCoords: { lat: number, lon: number } | undefined;
  endCoords: { lat: number, lon: number } | undefined;
  startAddress: string = '';
  endAddress: string = '';
  qrValue: string = ''; // Inicialmente vacío
  resultadoQR: string = '';

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private authServices:AuthService,
    private modalController: ModalController,
    private platform: Platform,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.platform.is('capacitor')){
      BarcodeScanner.isSupported().then()
      BarcodeScanner.checkPermissions().then()
      BarcodeScanner.removeAllListeners();
    }
    // OBTENEMOS EL UID DEL USUARIO LOGEADO Y LO ASIGNAMOS AL QR
    this.authServices.isLogged().subscribe(user=> {
      this.qrValue = user.uid;
    });
  }

  async openCamera() {
    const modal = await this.modalController.create({
      component: BarcodeScanningModalComponent,
      cssClass: 'barcode-scanner-modal',
      showBackdrop: false,
      componentProps: {
        formats: [],
        LensFacing: LensFacing.Back
      }
    });

    await modal.present();

    // DESPUES DE LEER EL QR
    const { data } = await modal.onDidDismiss();

    // SI SE OBTIENE INFORMACION EN DATA
    if (data?.barcode?.displayValue) {
      // COLOCAR LA LOGICA DE SU PROYECTO
      // EN MI CASO LO MANDARE A OTRA PAGINA
      this.resultadoQR = data.barcode.displayValue;
      
      setTimeout(()=>{
        this.router.navigate(['/profile', this.resultadoQR])
      }, 1000);
    }
  }

  ngAfterViewInit() {
    this.loadMap();
  }

  loadMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        this.map = L.map('map', {
          center: [-33.4489, -70.6693],
          zoom: 13,
          minZoom: 5,
          maxZoom: 18,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data © <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(this.map);

        observer.disconnect();

        window.addEventListener('resize', () => {
          this.map?.invalidateSize();
        });
      }
    });

    observer.observe(mapContainer);
  }

  async getCoordinates(address: string) {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${address}, Santiago, Chile`);
      const data = await response.json();
      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
        };
      } else {
        throw new Error('No se encontraron coordenadas para la dirección.');
      }
    } catch (error) {
      console.error('Error obteniendo coordenadas: ', error);
      throw error;
    }
  }

  async findRoute() {
    this.startAddress = (document.getElementById('startAddress') as HTMLInputElement).value;
    this.endAddress = (document.getElementById('endAddress') as HTMLInputElement).value;

    try {
      this.startCoords = await this.getCoordinates(this.startAddress);
      this.endCoords = await this.getCoordinates(this.endAddress);

      const routeResponse = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248a24244c4ff414132baa7c458bcbcb3f5&start=${this.startCoords.lon},${this.startCoords.lat}&end=${this.endCoords.lon},${this.endCoords.lat}`);
      const routeData = await routeResponse.json();

      if (routeData.features && routeData.features.length > 0) {
        const coordinates = routeData.features[0].geometry.coordinates.map((coord: any) => [coord[1], coord[0]]);

        if (this.map) {
          if (this.currentRoute) {
            this.map.removeLayer(this.currentRoute);
          }
          this.currentRoute = L.polyline(coordinates, { color: 'blue' }).addTo(this.map);
          this.map.fitBounds(this.currentRoute.getBounds());

          const distance = routeData.features[0].properties.segments[0].distance / 1000;
          this.tripCost = distance * 320;
        }
      } else {
        throw new Error('No se encontró una ruta para las direcciones ingresadas.');
      }
    } catch (error) {
      console.error('Error al obtener la ruta: ', error);
    }
  }

  async createTrip() {
    const user = await this.afAuth.currentUser;
    if (!user) {
      console.error('Usuario no autenticado');
      return;
    }

    if (this.startCoords && this.endCoords && this.tripCost > 0) {
      const tripData = {
        startCoords: this.startCoords,
        endCoords: this.endCoords,
        startAddress: this.startAddress,
        endAddress: this.endAddress,
        tripCost: this.tripCost,
        availableSeats: this.availableSeats,
        createdAt: new Date(),
        uid: user.uid,
      };

      try {
        const docRef = await this.firestore.collection('trips').add(tripData);
        console.log('Viaje creado exitosamente');
        this.router.navigate(['/trip-details', docRef.id]);
      } catch (error) {
        console.error('Error al crear el viaje:', error);
      }
    } else {
      console.error('Datos incompletos para crear el viaje');
    }
  }

  updateSeats(action: 'add' | 'remove') {
    if (action === 'add') {
      this.availableSeats++;
    } else if (action === 'remove' && this.availableSeats > 0) {
      this.availableSeats--;
    }
  }

  showRoute() {
    this.createTrip(); // Crear el viaje y mostrar el QR
  }
}
