import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-conductor',
  templateUrl: './home-conductor.page.html',
  styleUrls: ['./home-conductor.page.scss'],
})
export class HomeConductorPage implements OnInit {

  driverName: string = 'Elias Alcaide'; // Nombre del conductor
  totalKilometers: number = 0;
  trips: { id: number, destination: string, date: Date, kilometers: number }[] = [];
  userEmail: string | null = '';

  constructor() { }

  ngOnInit() {
    this.userEmail = localStorage.getItem('userEmail');
    this.loadTrips();
  }

  loadTrips() {
    // Datos simulados para los viajes
    this.trips = [
      { id: 1, destination: 'Destino A', date: new Date('2024-08-01'), kilometers: 120 },
      { id: 2, destination: 'Destino B', date: new Date('2024-08-02'), kilometers: 80 },
      { id: 3, destination: 'Destino C', date: new Date('2024-08-03'), kilometers: 150 }
    ];

    // Calcular kilómetros totales
    this.totalKilometers = this.trips.reduce((acc, trip) => acc + trip.kilometers, 0);
  }
  
}