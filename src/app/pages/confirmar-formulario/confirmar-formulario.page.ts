import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-confirmar-formulario',
  templateUrl: './confirmar-formulario.page.html',
  styleUrls: ['./confirmar-formulario.page.scss'],
})
export class ConfirmarFormularioPage implements OnInit {
  conductores: any[] = [
    { fullName: 'Juan Pérez', phone: '1234567890', licenseNumber: 'ABC123', plateNumber: 'XYZ456', vehicleBrand: 'Toyota', vehicleModel: 'Corolla', editing: false, confirmed: false },
    { fullName: 'Ana López', phone: '0987654321', licenseNumber: 'DEF456', plateNumber: 'UVW123', vehicleBrand: 'Honda', vehicleModel: 'Civic', editing: false, confirmed: false },
  ];

  constructor(private alertCtrl: AlertController) {}

  ngOnInit() {}

  async showAlert(conductor: any, index: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Acción',
      message: `¿Desea confirmar la información del conductor ${conductor.fullName}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Acción cancelada');
          }
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.confirmarConductor(index);
          }
        }
      ]
    });

    await alert.present();
  }

  async showRejectAlert(conductor: any, index: number) {
    const alert = await this.alertCtrl.create({
      header: 'Rechazar Información',
      message: `¿Desea rechazar la información del conductor ${conductor.fullName}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Acción cancelada');
          }
        },
        {
          text: 'Rechazar',
          handler: () => {
            this.rechazarConductor(index);
          }
        }
      ]
    });

    await alert.present();
  }

  // Método para activar/desactivar el modo de edición
  editarConductor(index: number) {
    this.conductores[index].editing = !this.conductores[index].editing;
  }

  // Método para confirmar los datos
  confirmarConductor(index: number) {
    this.conductores[index].confirmed = true;
    this.conductores[index].editing = false;
  }

  // Método para rechazar y eliminar el conductor
  rechazarConductor(index: number) {
    this.conductores.splice(index, 1);
  }
}