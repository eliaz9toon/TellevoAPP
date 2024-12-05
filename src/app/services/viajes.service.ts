import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Viaje } from '../interfaces/viaje';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app'; // Asegúrate de importar firebase

@Injectable({
  providedIn: 'root',
})
export class ViajesService {
  constructor(private firestore: AngularFirestore) {}

  // Obtener todos los viajes desde Firebase
  getViajes(): Observable<Viaje[]> {
    return this.firestore.collection<Viaje>('viajes').valueChanges({ idField: 'id' });
  }

  // Agregar un viaje nuevo a Firebase
  addViaje(viaje: Viaje) {
    return this.firestore.collection('viajes').add(viaje);
  }

  // Actualizar un viaje en Firebase
  updateViaje(viaje: Viaje) {
    const viajeRef = this.firestore.collection('viajes').doc(viaje.id);
    return viajeRef.update(viaje);
  }

  // Eliminar un viaje de Firebase
  deleteViaje(id: string) {
    return this.firestore.collection('viajes').doc(id).delete();
  }

  // Reservar un asiento
  reserveSeat(viajeId: string) {
    const viajeRef = this.firestore.collection('viajes').doc(viajeId);
    return viajeRef.update({
      availableSeats: firebase.firestore.FieldValue.increment(-1), // Usa firebase.firestore.FieldValue
    });
  }
}
