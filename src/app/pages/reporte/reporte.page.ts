import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.page.html',
  styleUrls: ['./reporte.page.scss'],
})
export class ReportePage {
  matricula: string = '';
  queja: string = '';

  constructor(private alertController: AlertController) {}

  async enviarQueja() {
    // Aquí podrías agregar la lógica para enviar la queja a un servidor o guardarla localmente
    console.log('Matrícula:', this.matricula);
    console.log('Queja:', this.queja);

    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: 'Tu queja ha sido enviada exitosamente.',
      buttons: ['OK'],
    });

    await alert.present();

    // Limpiar los campos después de enviar
    this.matricula = '';
    this.queja = '';
  }
}
