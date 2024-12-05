import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, MenuController, Platform } from '@ionic/angular';
import { AuthService } from 'src/app/services/firebase/auth.service';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/interfaces/usuario';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  emailValue: string = ''; // Definimos emailValue
  passValue: string = ''; // Definimos passValue
  showPassword: boolean = false; // Definimos showPassword

  constructor(
    private platform: Platform, // Añadido para la desactivación del botón de "volver"
    private router: Router, 
    private alertController: AlertController,
    private loadingController: LoadingController, 
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private menuController: MenuController,
    private firestore: AngularFirestore,
    private http: HttpClient,
    private afAuth: AngularFireAuth
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    this.menuController.enable(false); // Desactiva el menú en la página de inicio de sesión

    // Desactivar swipe gesture en la página de login
    this.menuController.swipeGesture(false);  // Deshabilita el swipe gesture

    // Desactivar el botón de "volver" en la página de login
    this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.router.url === '/login') {
        // No realizar ninguna acción cuando el usuario esté en la página de login
        return; // Esto es equivalente a devolver 'void'
      }
    });
  }
  async login() {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    try {
      const usuarioLogeado = await this.authService.login(email, password);

      if (usuarioLogeado.user) {
        const loading = await this.loadingController.create({
          message: 'Cargando...',
          duration: 2000
        });

        await loading.present();

        const usuario = await this.firestore.collection('usuarios')
          .doc(usuarioLogeado.user.uid).get().toPromise();
        const userData = usuario?.data() as Usuario;

        setTimeout(async () => {
          await loading.dismiss();

          if (userData.tipo === 'admin') {
            this.router.navigate(['/admin-dashboard']);
          } else if (userData.tipo === 'usuario') {
            this.router.navigate(['/usuario-dashboard']);
          } else if (userData.tipo === 'conductor') {
            this.router.navigate(['/mapa']);
          } else {
            this.router.navigate(['/home']);
          }
        }, 2000);
      } 
    } catch (error) {
      this.handleAuthError(error);
    }
  }

  // Manejo de errores de autenticación
  handleAuthError(error: any) {
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });

    let errorMessage = 'Acceso denegado! credenciales no válidas.';
    if (error?.code === 'auth/user-not-found') {
      errorMessage = 'No se encontró ningún usuario con estas credenciales.';
    } else if (error?.code === 'auth/wrong-password') {
      errorMessage = 'Contraseña incorrecta.';
    }

    Toast.fire({
      icon: "error",
      title: 'Error!',
      text: errorMessage,
    });
  }

  async loginWithGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await this.afAuth.signInWithPopup(provider);
  
      if (result.user) {
        const userDoc = await this.firestore.collection('usuarios').doc(result.user.uid).get().toPromise();
  
        if (userDoc && userDoc.exists) { 
          // El usuario ya existe, solo lo redirigimos al dashboard
          this.router.navigate(['/usuario-dashboard']);
        } else { 
          // El usuario no existe, lo creamos en la base de datos
          const newUser: Usuario = {
            email: result.user.email!,
            nombre: result.user.displayName || '',
            pass: '', 
            tipo: 'usuario',
            foto: result.user.photoURL || ''
          };
          await this.firestore.collection('usuarios').doc(result.user.uid).set(newUser);
  
          this.router.navigate(['/usuario-dashboard']);
        }
      }
    } catch (error) {
      console.error('Error al iniciar sesión con Google', error);
      const firebaseError = error as firebase.auth.AuthError; // Aserción de tipo
  
      if (firebaseError.code === 'auth/account-exists-with-different-credential') {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El correo electrónico ya está registrado con otra cuenta.',
          heightAuto: false
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo iniciar sesión con Google',
          heightAuto: false
        });
      }
    }
  }

  async loginWithGithub() {
    try {
      const provider = new firebase.auth.GithubAuthProvider();
      const result = await this.afAuth.signInWithPopup(provider);
  
      if (result.user) {
        const userDoc = await this.firestore.collection('usuarios').doc(result.user.uid).get().toPromise();
  
        if (userDoc && userDoc.exists) { 
          // El usuario ya existe, lo redirigimos al dashboard
          this.router.navigate(['/usuario-dashboard']);
        } else { 
          // El usuario no existe, lo creamos en la base de datos
          const newUser: Usuario = {
            email: result.user.email!,
            nombre: result.user.displayName || '',
            pass: '', 
            tipo: 'usuario',
            foto: result.user.photoURL || ''
          };
          await this.firestore.collection('usuarios').doc(result.user.uid).set(newUser);
  
          this.router.navigate(['/usuario-dashboard']);
        }
      }
    } catch (error: unknown) {
      console.error('Error al iniciar sesión con GitHub', error);
  
      // Verificar si el error tiene la propiedad 'code'
      if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as { code: string };
  
        if (firebaseError.code === 'auth/account-exists-with-different-credential') {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El correo electrónico ya está registrado con otra cuenta.',
            heightAuto: false
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo iniciar sesión con GitHub',
            heightAuto: false
          });
        }
      } else {
        // Manejar otros tipos de errores que puedan ocurrir
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error inesperado al intentar iniciar sesión con GitHub.',
          heightAuto: false
        });
      }
    }
  }

  async generateRandomUser(userType: 'usuario' | 'conductor') {
    try {
      const randomEmail = userType === 'usuario'
        ? `user${Math.floor(Math.random() * 10000)}@alumno.com`
        : `conductor${Math.floor(Math.random() * 10000)}@conductor.com`;

      const password = Math.random().toString(36).slice(-8);
      const nombre = `User ${Math.floor(Math.random() * 10000)}`;

      const userCredential = await this.afAuth.createUserWithEmailAndPassword(randomEmail, password);

      await this.firestore.collection('usuarios').doc(userCredential.user?.uid).set({
        email: randomEmail,
        nombre: nombre,
        pass: password, 
        tipo: userType, 
        uid: userCredential.user?.uid
      });

      Swal.fire({
        icon: 'success',
        title: 'Usuario creado',
        text: `Email: ${randomEmail} | Nombre: ${nombre} | Tipo: ${userType} | UID: ${userCredential.user?.uid}`,
        heightAuto: false
      });

    } catch (error) {
      this.handleAuthError(error);
    }
  }

  createUsuario() {
    this.generateRandomUser('usuario');
  }

  createConductor() {
    this.generateRandomUser('conductor');
  }

  // Método para mostrar y ocultar la contraseña
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
