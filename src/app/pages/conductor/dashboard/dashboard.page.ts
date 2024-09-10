import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {
  selectedPointA: string = '';
  selectedPointB: string = '';
  fare: number | null = null;
  numberOfPeople: number | null = null;
  routeImage: string = 'assets/icon/mapa.png'; // URL de la imagen del recorrido
  showRouteImage: boolean = false;
  formComplete: boolean = false;

  constructor() {
    // No es necesario inicializar `checkFormValidity` aquí, ya que `ngModelChange` se encargará
  }

  // Comprobar si todos los campos necesarios están completos
  checkFormValidity() {
    this.formComplete = this.selectedPointA !== '' &&
                        this.selectedPointB !== '' &&
                        this.fare != null &&
                        this.numberOfPeople != null;

    this.showRouteImage = this.formComplete;
  }

  // Función para manejar la acción del botón de escanear QR
  showQRCodeScanner() {
    // Aquí podrías agregar la lógica para abrir el lector de QR
    console.log('Abrir lector de QR');
  }
}


