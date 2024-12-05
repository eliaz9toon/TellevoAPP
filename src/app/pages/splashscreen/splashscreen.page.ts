import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuario';
import { AuthService } from 'src/app/services/firebase/auth.service';
import { NativeBiometric } from 'capacitor-native-biometric';
import { IonRouterOutlet } from '@ionic/angular';  // Importa IonRouterOutlet

@Component({
  selector: 'app-splashscreen',
  templateUrl: './splashscreen.page.html',
  styleUrls: ['./splashscreen.page.scss'],
})
export class SplashscreenPage implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private firestore: AngularFirestore,
    private routerOutlet: IonRouterOutlet  // Inyecta IonRouterOutlet
  ) { }

  ngOnInit() {
    // Desactiva el swipe gesture en el Splash Screen
    this.routerOutlet.swipeGesture = false;  // Desactiva los gestos de arrastre

    // Redirección con temporizador
    setTimeout(() => {
      this.checkLogin();
    }, 2000);
  }

  async checkLogin() {
    this.authService.isLogged().subscribe(async (user) => {
      if (user) {
        try {
          // Verificación de huella digital
          await this.checkHuellaDigital();

          const usuario = await this.firestore.collection('usuarios')
            .doc(user.uid).get().toPromise();
          const userData = usuario?.data() as Usuario;

          if (userData) {
            if (userData.tipo === 'admin') {
              this.router.navigate(['/admin-dashboard']);
            } else if (userData.tipo === 'usuario') {
              this.router.navigate(['/usuario-dashboard']);
            } else {
              this.router.navigate(['/invitado-dashboard']);
            }
          }
        } catch (error) {
          this.router.navigate(['login']);
        }
      } else {
        this.router.navigate(['login']);
      }
    });
  }

  async checkHuellaDigital() {
    try {
      await NativeBiometric.verifyIdentity({
        reason: 'Por favor, autentícate para continuar',
        title: 'Autentificación Biométrica',
        subtitle: 'Usa tu huella digital o Face ID',
        description: 'Coloca tu huella en el sensor para ingresar.'
      });
    } catch (error) {
      throw error; // Captura cualquier error
    }
  }
}
