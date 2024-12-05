import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/firebase/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  emailValue: string = '';
  passValue: string = '';
  loginForm: FormGroup;
  showPassword: boolean = false;  // Agrega esta propiedad

  constructor(
    private router: Router, 
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private firestore: AngularFirestore
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
  }

  // Método para alternar la visibilidad de la contraseña
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async register() {
    try {
      const usuario = await this.authService.register(this.emailValue, this.passValue);
      const userCreado = usuario.user;

      if (userCreado) {

        await this.firestore.collection('usuarios').doc(userCreado.uid).set({
          uid: userCreado.uid,
          email: userCreado.email,
          pass: this.passValue,
          tipo: 'usuario',
          nombre: 'Un nombre completo'
        });

        let timerInterval: any;
        Swal.fire({
          title: "Procesando!",
          html: "Creando usuario...",
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
          if (result.dismiss === Swal.DismissReason.timer) {
            Swal.fire({
              title: 'Éxito!',
              text: 'Usuario creado correctamente!',
              icon: 'success',
              confirmButtonText: 'OK',
              heightAuto: false
            });
            this.router.navigate(['/login']);
          }
        });

      }

    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'No se puede registrar el usuario!',
        icon: 'error',
        confirmButtonText: 'OK',
        heightAuto: false
      });
    }
  }

}
