import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-trip-map-modal',
  templateUrl: './trip-map-modal.component.html',
  styleUrls: ['./trip-map-modal.component.scss'],
})
export class TripMapModalComponent implements OnInit, AfterViewInit {
  @Input() startCoords!: { lat: number, lon: number };
  @Input() endCoords!: { lat: number, lon: number };
  map: L.Map | undefined;
  currentRoute: L.Polyline | undefined;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.loadMap();
    }, 500); // Retrasar ligeramente la inicialización del mapa
  }

  loadMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    // Inicializa el mapa solo si no está ya inicializado
    if (!this.map) {
      this.map = L.map('map', {
        center: [this.startCoords.lat, this.startCoords.lon],
        zoom: 13,
        minZoom: 5,
        maxZoom: 18,
      });

      // Agregar capa de tiles de OpenStreetMap con un servidor alternativo
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(this.map);

      // Forzar el redimensionamiento para asegurar que el mapa se ajusta correctamente
      this.map.invalidateSize();
    }

    // Cargar la ruta
    this.loadRoute();
  }

  async loadRoute() {
    try {
      const routeResponse = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248a24244c4ff414132baa7c458bcbcb3f5&start=${this.startCoords.lon},${this.startCoords.lat}&end=${this.endCoords.lon},${this.endCoords.lat}`);
      const routeData = await routeResponse.json();

      if (routeData.features && routeData.features.length > 0) {
        const routeCoordinates: L.LatLngExpression[] = routeData.features[0].geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]);

        if (this.map) {
          // Dibuja la ruta en el mapa
          if (this.currentRoute) {
            this.map.removeLayer(this.currentRoute); // Elimina la ruta anterior si existe
          }
          this.currentRoute = L.polyline(routeCoordinates, { color: 'blue' }).addTo(this.map);
          this.map.fitBounds(this.currentRoute.getBounds()); // Ajusta el mapa para mostrar la ruta
        }
      } else {
        console.error('No se encontró una ruta para las coordenadas seleccionadas.');
      }
    } catch (error) {
      console.error('Error al obtener la ruta:', error);
    }
  }

  dismissModal() {
    this.modalController.dismiss();
  }
}
