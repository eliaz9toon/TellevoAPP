// src/app/services/map.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private mapboxAccessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'; // Reemplaza con tu token de Mapbox

  constructor(private http: HttpClient) {}

  geocode(address: string): Observable<any> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    return this.http.get(url);
  }

  getRoute(startCoords: any, endCoords: any): Observable<any> {
    const routeUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords.lon},${startCoords.lat};${endCoords.lon},${endCoords.lat}?geometries=geojson&access_token=${this.mapboxAccessToken}`;
    return this.http.get(routeUrl);
  }
}
