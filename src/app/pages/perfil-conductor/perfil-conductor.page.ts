import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular'; // Importa MenuController

@Component({
  selector: 'app-perfil-conductor',
  templateUrl: './perfil-conductor.page.html',
  styleUrls: ['./perfil-conductor.page.scss'],
})
export class PerfilConductorPage {
  // Inyecta el Router y el MenuController
  constructor(private router: Router, private menuController: MenuController) {}

  // Método que maneja la navegación a "home-conductor"
  navigateToHomeConductor() {
    this.router.navigate(['/home-conductor']); // Navegar a la ruta home-conductor
  }

  // Método para abrir el menú lateral
  openMenu() {
    this.menuController.open(); // Abre el menú
  }
}
