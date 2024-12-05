import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular'; // Importa IonRouterOutlet

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  selectedPointA: string = '';
  selectedPointB: string = '';
  fare: number | null = null;
  numberOfPeople: number | null = null;
  routeImage: string = 'assets/icon/mapa.png'; // URL de la imagen del recorrido
  showRouteImage: boolean = false;
  formComplete: boolean = false;

  constructor(private routerOutlet: IonRouterOutlet) { }

  ngOnInit() {
    this.routerOutlet.swipeGesture = true; // Habilita el swipeGesture solo en esta página
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
