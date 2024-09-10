import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
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

  constructor(
    private viajesService: ViajesService, 
    private alertController: AlertController,
    private navCtrl: NavController // Añadido para redirección
  ) { }

  ngOnInit() {
    this.obtenerViajes();
  }

  obtenerViajes() {
    this.verViajes = this.viajesService.getViajes();
  }

  async confirmarViaje(viaje: Viaje) {
    if (this.selectedViaje && this.selectedViaje !== viaje) {
      this.cancelarViaje();
    }
    
    // Aquí deberías verificar si el usuario está registrado
    // Asumiremos que tienes un método para eso, por ejemplo, `isUserRegistered()`
    if (this.isUserRegistered()) {
      this.selectedViaje = viaje;
      viaje.pasajeros -= 1;
      this.viajesService.updateViaje(viaje);
    } else {
      const alert = await this.alertController.create({
        header: 'Registro requerido',
        message: 'Necesitas estar registrado para confirmar el viaje. ¿Deseas registrarte ahora?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
              console.log('Registro cancelado');
            }
          },
          {
            text: 'Sí',
            handler: () => {
              this.navCtrl.navigateForward('/register'); // Redirige a la página de registro
            }
          }
        ]
      });

      await alert.present();
    }
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

  isUserRegistered(): boolean {
    // Implementa la lógica para verificar si el usuario está registrado
    // Retorna true si está registrado, false si no lo está
    return false; // Cambia esto según tu lógica de autenticación
  }
}
