import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-formulario-conductor',
  templateUrl: './formulario-conductor.page.html',
  styleUrls: ['./formulario-conductor.page.scss'],
})
export class FormularioConductorPage {
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    this.registerForm = this.formBuilder.group({
      fullName: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      licenseNumber: ['', [Validators.required]],
      plateNumber: ['', [Validators.required]],
      vehicleBrand: ['', [Validators.required]],
      vehicleModel: ['', [Validators.required]],
    });
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      console.log('Form Data:', formData);  // Solo muestra los datos en consola

      const toast = await this.toastCtrl.create({
        message: 'Registro exitoso',
        duration: 2000,
        color: 'success'
      });
      toast.present();

      this.router.navigate(['/confirmar-formulario']);  // Navegar a la página de confirmación
    } else {
      const toast = await this.toastCtrl.create({
        message: 'Por favor, complete todos los campos correctamente',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }
}
