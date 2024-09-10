import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular'; // Importa AlertController
import { Viaje } from 'src/app/interfaces/viaje';
import { ViajesService } from 'src/app/services/viajes.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  verViajes: Viaje[] = [];
  selectedViaje: Viaje | null = null;

  constructor(private viajesService: ViajesService, private alertController: AlertController) { }

  ngOnInit() {
    this.obtenerViajes();
  }

  obtenerViajes() {
    this.verViajes = this.viajesService.getViajes();
  }

  confirmarViaje(viaje: Viaje) {
    if (this.selectedViaje && this.selectedViaje !== viaje) {
      this.cancelarViaje();
    }
    this.selectedViaje = viaje;
    viaje.pasajeros -= 1;
    this.viajesService.updateViaje(viaje);
  }

  async cancelarViaje() {
    if (!this.selectedViaje) return;

    const alert = await this.alertController.create({
      header: 'Confirmar cancelación',
      message: '¿Estás seguro que deseas cancelar este viaje?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancelación del viaje anulada');
          }
        },
        {
          text: 'Sí',
          handler: () => {
            // Si el usuario confirma, cancelamos el viaje
            this.selectedViaje!.pasajeros += 1;
            this.viajesService.updateViaje(this.selectedViaje!);
            this.selectedViaje = null; // Desmarcar el viaje después de cancelar
            console.log('Viaje cancelado');
          }
        }
      ]
    });

    await alert.present();
  }
}
