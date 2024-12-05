import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TripService {
  constructor(private firestore: Firestore) {}

  // Método para obtener los viajes en tiempo real
  getTrips(): Observable<any[]> {
    const tripsCollection = collection(this.firestore, 'trips'); // Asegúrate de usar el nombre correcto de la colección
    return collectionData(tripsCollection, { idField: 'id' });  // Escuchar cambios en la colección 'trips'
  }

  // Método para crear un viaje
  async createTrip(tripData: any, uid: string) {
    const trip = {
      ...tripData,
      uid: uid,  // Agrega el uid del conductor aquí
      createdAt: new Date(),  // Asegúrate de tener una fecha de creación
    };

    const tripsCollection = collection(this.firestore, 'trips');
    await addDoc(tripsCollection, trip); // Agrega el nuevo viaje a la colección
  }
}
