import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

interface Trip {
  startAddress: string;
  endAddress: string;
  tripCost: number;
  availableSeats: number;
  documentId: string;
}

@Component({
  selector: 'app-ver-mapa',
  templateUrl: './ver-mapa.page.html',
  styleUrls: ['./ver-mapa.page.scss'],
})
export class VerMapaPage implements OnInit {
  trips$: Observable<Trip[]> | null = null;
  selectedTrip: Trip | null = null;

  constructor(private firestore: AngularFirestore) {}

  ngOnInit() {
    // Obtener los viajes desde Firebase
    this.trips$ = this.firestore.collection<Trip>('trips').valueChanges({ idField: 'documentId' });
  }

  // Método para seleccionar un viaje
  selectTrip(trip: Trip) {
    this.selectedTrip = trip;
  }

  // Método para descontar un asiento
  async updateAvailableSeats() {
    if (this.selectedTrip && this.selectedTrip.availableSeats > 0) {
      try {
        const tripRef = this.firestore.collection('trips').doc(this.selectedTrip.documentId).ref;

        await this.firestore.firestore.runTransaction(async (transaction) => {
          const tripDoc = await transaction.get(tripRef);

          if (!tripDoc.exists) {
            console.error('El viaje no existe en la base de datos.');
            alert('El viaje no existe en la base de datos.');
            return;
          }

          const data = tripDoc.data() as Trip;

          if (data.availableSeats > 0) {
            transaction.update(tripRef, {
              availableSeats: data.availableSeats - 1,
            });
            this.selectedTrip!.availableSeats = data.availableSeats - 1;
            alert('¡Has tomado el viaje!');
          } else {
            alert('No hay asientos disponibles.');
          }
        });
      } catch (error) {
        console.error('Error al actualizar asientos:', error);
        alert('Error al tomar el viaje. Inténtalo de nuevo.');
      }
    } else {
      alert('No hay asientos disponibles.');
    }
  }
}