import { Injectable } from '@angular/core';
import { Viaje } from '../interfaces/viaje';

@Injectable({
  providedIn: 'root'
})
export class ViajesService {

  viajes: Viaje[] = [
    { inicio:'Sede Puente Alto', fin:' Mall Plaza Vespucio', costo:'1890', pasajeros:4 ,imagen:'assets/icon/Duoc.gif' },
    { inicio:'Sede Puente Alto', fin:'Cerro San Cristóbal', costo:'2600', pasajeros:3 ,imagen:'assets/icon/Duoc2-3.gif' },
    { inicio:'Sede Puente Alto', fin:'Barrio Lastarria', costo:'3600', pasajeros:3 ,imagen:'assets/icon/Duoc5.gif' },
  ]

  constructor() { }

  getViajes(): Viaje[] {
    return this.viajes;
  }

  getViajeByNombre() {

  }

  addViaje() {

  }

  deleteViaje() {

  }

  updateViaje(viaje: Viaje) {
    const index = this.viajes.findIndex(v => v.inicio === viaje.inicio && v.fin === viaje.fin);
    if (index > -1) {
      this.viajes[index] = viaje;
    }
  }
}