import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  trips: any[] = [];

  constructor(private firestore: AngularFirestore) {}

  ngOnInit() {
    this.loadTrips();
  }

  loadTrips() {
    this.firestore
      .collection('trips', (ref) => ref.orderBy('createdAt', 'desc'))
      .valueChanges()
      .subscribe((data) => {
        this.trips = data;
        this.trips.forEach((trip) => {
          this.loadConductorName(trip);
        });
      });
  }

  loadConductorName(trip: any) {
    if (trip.uid) {  // Verifica que el uid exista
      this.firestore
        .collection('usuarios')
        .doc(trip.uid)
        .valueChanges()
        .subscribe((user: any) => {
          if (user && user.nombre) {
            trip.userName = user.nombre;  // Agrega el nombre del conductor al viaje
          } else {
            trip.userName = 'Conductor Desconocido';  // Manejo de errores
          }
        });
    } else {
      trip.userName = 'Conductor Desconocido';  // Si no hay uid
    }
  }
}
