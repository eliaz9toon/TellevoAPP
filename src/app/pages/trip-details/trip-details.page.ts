import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-trip-details',
  templateUrl: './trip-details.page.html',
  styleUrls: ['./trip-details.page.scss'],
})
export class TripDetailsPage implements OnInit, OnDestroy {
  tripId: string = '';
  tripData: any;
  qrValue: string = '';
  tripSubscription: Subscription | null = null; // Para la suscripción en tiempo real

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private router: Router,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    this.tripId = this.route.snapshot.paramMap.get('id')!;
    await this.loadTripData();
  }

  // Método para cargar la información del viaje
  async loadTripData() {
    this.tripSubscription = this.firestore
      .collection('trips')
      .doc(this.tripId)
      .valueChanges()
      .subscribe((trip: any) => {
        this.tripData = trip;
        this.qrValue = this.tripData?.uid;
      });
  }

  // Método para finalizar el viaje
  async endTrip() {
    await this.firestore.collection('trips').doc(this.tripId).delete();
    this.router.navigate(['/mapa']);
  }

  // Método para disminuir el número de asientos
  async decreaseSeatCount() {
    if (this.tripData?.availableSeats > 0) {
      const newSeats = this.tripData.availableSeats - 1;
      await this.firestore.collection('trips').doc(this.tripId).update({ availableSeats: newSeats });
      this.tripData.availableSeats = newSeats; // Actualizar en tiempo real
    } else {
      console.error('No hay asientos disponibles para descontar');
    }
  }

  // Método para cancelar la suscripción al salir de la página
  ngOnDestroy() {
    if (this.tripSubscription) {
      this.tripSubscription.unsubscribe();
    }
  }
}
