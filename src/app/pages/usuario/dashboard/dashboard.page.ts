import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController, ModalController, MenuController } from '@ionic/angular';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Router } from '@angular/router';
import { IonRouterOutlet } from '@ionic/angular'; // Importa IonRouterOutlet
import { AuthService } from 'src/app/services/firebase/auth.service'; // Ruta correcta para el servicio de autenticación
import { Platform } from '@ionic/angular'; // Importa Platform para controlar el botón de retroceso

interface Trip {
  startAddress: string;
  endAddress: string;
  tripCost: number;
  availableSeats: number;
  uid: string;
  userName?: string;
  startCoords?: any;
  endCoords?: any;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  trips: Trip[] = [];
  isSupported = false;
  barcodes: Barcode[] = [];
  userName: string | undefined;

  constructor(
    private firestore: AngularFirestore,
    private modalController: ModalController,
    private alertController: AlertController,
    private router: Router,
    private routerOutlet: IonRouterOutlet,
    private authService: AuthService, // Inyectamos el servicio de autenticación
    private platform: Platform, // Inyecta Platform
    private menuController: MenuController // Inyecta el MenuController
  ) {}

  ngOnInit() {
    // Desactivar el swipeGesture en la página de Dashboard
    this.routerOutlet.swipeGesture = false;

    // Habilitar el menú lateral en esta página, solo si el usuario está autenticado
    this.authService.getUser().subscribe((user) => {
      if (user) {
        this.menuController.enable(true);  // Habilitar el menú si el usuario está autenticado
      } else {
        this.menuController.enable(false); // Deshabilitar el menú si no hay usuario autenticado
        this.router.navigate(['/login']); // Redirigir a login si no hay usuario
      }
    });

    // Deshabilitar el botón de retroceso
    this.platform.backButton.subscribeWithPriority(10, () => {
      // No hacemos nada cuando presionamos el botón de retroceso
    });

    // Cargar los viajes
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
    this.loadTrips();
    this.loadUserData();
  }

  loadTrips() {
    this.firestore
      .collection('trips', (ref) => ref.orderBy('createdAt', 'desc'))
      .valueChanges()
      .subscribe((data) => {
        this.trips = (data as Trip[]).map((trip) => ({ ...trip, showCameraButton: false }));
        this.trips.forEach((trip) => {
          this.loadConductorName(trip);
        });
      });
  }

  loadConductorName(trip: Trip) {
    this.firestore
      .collection('usuarios')
      .doc(trip.uid)
      .valueChanges()
      .subscribe((user: any) => {
        trip.userName = user ? user.nombre : 'Conductor Desconocido';
      });
  }

  takeTrip(trip: Trip) {
    // Almacena el viaje seleccionado en localStorage
    localStorage.setItem('selectedTrip', JSON.stringify(trip));

    // Redirige a la página de inicio
    this.router.navigate(['/home']);
  }

  loadUserData() {
    // Obtiene el usuario actual desde el servicio de autenticación
    this.authService.getUser().subscribe((user) => {
      if (user) {
        this.userName = user.displayName || 'Usuario';
      }
    });
  }
}
