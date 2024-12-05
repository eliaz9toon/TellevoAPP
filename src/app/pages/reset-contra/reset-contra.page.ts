import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from '../../services/usuario.service';
import { NavController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/firebase/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-contra',
  templateUrl: './reset-contra.page.html',
  styleUrls: ['./reset-contra.page.scss'],
})
  export class ResetContraPage implements OnInit {

    email: string = '';
  
    constructor(private authService:AuthService) { }
  
    ngOnInit() {
    }
  
    async recoveryPassword() {
      try {
        await this.authService.recoveryPassword(this.email);
        let timerInterval: any;
          Swal.fire({
            title: "Procesando!",
            html: "Enviando correo...",
            timer: 1500,
            timerProgressBar: true,
            heightAuto: false,
            didOpen: () => {
              Swal.showLoading();
              const timer = Swal.getPopup()!.querySelector("b");
              timerInterval = setInterval(() => {
                timer!.textContent = `${Swal.getTimerLeft()}`;
              }, 100);
            },
            willClose: () => {
              clearInterval(timerInterval);
            }
          }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
              Swal.fire({
                title: 'Éxito!',
                text: 'Correo enviado correctamente!',
                icon: 'success',
                confirmButtonText: 'OK',
                heightAuto: false
              });
            }
          });
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'No se puede enviar el correo al usuario!',
          icon: 'error',
          confirmButtonText: 'OK',
          heightAuto: false
        });
      }
    }
  
  }
  
