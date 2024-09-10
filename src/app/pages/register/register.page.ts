import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuariosService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  emailValue?: string;
  passValue?: string;
  loginForm: FormGroup;

  constructor(
    private router: Router, 
    private alertController: AlertController,
    private loadingController: LoadingController, 
    private formBuilder: FormBuilder,
    private usuarioServices: UsuariosService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
  }

  register() {
    const aux: Usuario = {
      email: this.emailValue || '',
      pass: this.passValue || '',
      tipo: 'usuario'
    }

    this.usuarioServices.addUsuario(aux);
    // alerta o un loading darle color
    this.router.navigate(['/login']);    
  }

}
