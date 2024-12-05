import { Component, OnInit, ViewChild } from '@angular/core';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController, ModalController, MenuController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonContent } from '@ionic/angular';
import { TripMapModalComponent } from 'src/app/trip-map-modal/trip-map-modal.component';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import Swal from 'sweetalert2';


export interface Trip {
  startAddress: string;
  endAddress: string;
  tripCost: number;
  availableSeats: number;
  uid: string;
  userName?: string;
  startCoords?: { lat: number, lon: number };
  endCoords?: { lat: number, lon: number };
  documentId: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  isSupported = false;
  barcodes: Barcode[] = [];
  selectedTrip: Trip | null = null;
  qrScanned = false; // Variable para controlar si el QR ha sido escaneado

  @ViewChild(IonContent, { static: false }) content!: IonContent;

  constructor(
    private alertController: AlertController,
    private modalController: ModalController,
    private firestore: AngularFirestore,
    private menuController: MenuController,
    private router: Router,
    private platform: Platform
  ) {}

  ngOnInit() {
    // Habilita el swipe gesture para el menú lateral
    this.menuController.swipeGesture(true);

    // Deshabilita el botón de retroceso físico para evitar comportamiento inesperado en esta pantalla
    this.platform.backButton.subscribeWithPriority(10, () => {
      // No realiza ninguna acción en la pulsación del botón físico
    });

    const tripData = localStorage.getItem('selectedTrip');
    if (tripData) {
      this.selectedTrip = JSON.parse(tripData);
    }

    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
  }

  async openMapModal(trip: Trip | null) {
    if (!trip) return;

    const modal = await this.modalController.create({
      component: TripMapModalComponent,
      componentProps: {
        startCoords: trip.startCoords,
        endCoords: trip.endCoords,
      },
    });
    await modal.present();
  }

  // Redirigir al mapa de un viaje
  async goToVerMapa(trip: Trip) {
    console.log('Selected Trip:', trip);  // Verifica los detalles del viaje
    this.router.navigate(['/ver-mapa'], { queryParams: { id: trip.documentId } });
  }

  // Método para escanear el código QR
  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }

    const { barcodes } = await BarcodeScanner.scan();
    this.barcodes.push(...barcodes);

    const scannedUid = barcodes[0]?.rawValue;

    if (scannedUid) {
      // Establece que el QR fue escaneado correctamente
      this.qrScanned = true;
      // Redirige a la página Ver Mapa con el UID como parámetro
      this.router.navigate(['/home'], { queryParams: { uid: scannedUid } });
    } else {
      console.error('El código QR no contiene un UID válido.');
    }
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permiso denegado',
      message: 'Por favor, otorga permiso para acceder a la cámara.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  // Redirige al usuario al dashboard de usuario
  goToDashboard() {
    this.router.navigate(['/usuario-dashboard']);
  }

  disminuirAsiento(trip: Trip | null): void {
    if (!trip || trip.availableSeats <= 0 || !trip.uid) {
      console.error('No hay viaje seleccionado o no hay UID');
      return;
    }
  
    // Realiza una consulta para encontrar el viaje con el UID correspondiente
    this.firestore.collection('trips', ref => ref.where('uid', '==', trip.uid))
      .get()
      .toPromise()
      .then(querySnapshot => {
        if (!querySnapshot || querySnapshot.empty) {
          console.error('No se encontró el viaje con el UID especificado');
          return;
        }
  
        // Suponiendo que solo hay un documento con el mismo UID
        const docSnapshot = querySnapshot.docs[0]; // Accedemos al primer documento que coincida
        const updatedSeats = trip.availableSeats - 1;
  
        // Actualiza el número de asientos disponibles
        this.firestore.collection('trips').doc(docSnapshot.id).update({
          availableSeats: updatedSeats
        }).then(() => {
          // Actualiza el objeto localmente
          if (this.selectedTrip) {
            this.selectedTrip.availableSeats = updatedSeats;
          }
  
          // Mostrar el SweetAlert2 y escuchar cambios en Firebase
          Swal.fire({
            icon: 'success',
            title: 'Disfrute su viaje',
            text: `Se aparto el asiento correctamente`,
            allowOutsideClick: false, // Bloquear el cierre manual
            allowEscapeKey: false,   // Deshabilitar cierre con Escape
            heightAuto: false,
            showConfirmButton: false, // Quitar el botón "OK"
            didOpen: () => {
              // Monitorear el documento en Firebase para cerrar el SweetAlert2
              this.firestore.collection('trips').doc(docSnapshot.id).snapshotChanges().subscribe(snapshot => {
                if (!snapshot.payload.exists) { // Si el documento se elimina
                  Swal.close(); // Cerrar el SweetAlert2
                  this.router.navigate(['/usuario-dashboard']); // Redirigir al dashboard de usuario
                }
              });
            }
          });
  
        }).catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo apartar el asiento',
            heightAuto: false
          });
        });
      }).catch((error) => {
        console.error('Error al realizar la consulta para encontrar el viaje: ', error);
      });
  }
  
}
