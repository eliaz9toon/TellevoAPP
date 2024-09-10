import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from '../../services/usuario.service';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-reset-contra',
  templateUrl: './reset-contra.page.html',
  styleUrls: ['./reset-contra.page.scss'],
})
export class ResetContraPage {
  changePasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private navCtrl: NavController,
    private toastController: ToastController
  ) {
    // Agregamos el campo email al formulario
    this.changePasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],  // Campo de email
      password: ['', [Validators.required, Validators.minLength(6)]],  // Campo de nueva contraseña
      confirmPassword: ['', Validators.required]  // Campo de confirmar contraseña
    }, { validator: this.passwordMatchValidator });
  }

  // Verifica que las contraseñas coincidan
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  async changePassword() {
    if (this.changePasswordForm.valid) {
      const email = this.changePasswordForm.get('email')?.value;
      const newPassword = this.changePasswordForm.get('password')?.value;

      // Verificar si el correo está disponible en el sistema
      const user = this.usuariosService.getUsuarioByEmail(email);
      if (user) {
        // Actualizar la contraseña del usuario
        this.usuariosService.updatePassword(email, newPassword);

        const toast = await this.toastController.create({
          message: 'Contraseña actualizada con éxito',
          duration: 2000,
          color: 'success'
        });
        toast.present();

        // Navegar de regreso a la página de inicio de sesión
        this.navCtrl.navigateBack('/login');
      } else {
        const toast = await this.toastController.create({
          message: 'El correo no existe en el sistema',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
      }
    } else {
      const toast = await this.toastController.create({
        message: 'Por favor, revisa los campos.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }
}

