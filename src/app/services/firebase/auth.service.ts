import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { Usuario } from '../../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private angularFireAuth: AngularFireAuth,
    private angularFirestore: AngularFirestore,
    private router: Router
  ) { }

  // Verifica si el usuario está logueado
  isLogged(): Observable<any> {
    return this.angularFireAuth.authState;
  }

  // Iniciar sesión con correo y contraseña
  login(email: string, pass: string) {
    return this.angularFireAuth.signInWithEmailAndPassword(email, pass);
  }

  // Registrar usuario con correo y contraseña
  register(email: string, pass: string) {
    return this.angularFireAuth.createUserWithEmailAndPassword(email, pass);
  }

  // Cerrar sesión
  logout() {
    return this.angularFireAuth.signOut();
  }

  // Recuperar la contraseña
  recoveryPassword(email: string) {
    return this.angularFireAuth.sendPasswordResetEmail(email)
      .then(() => {
        console.log('Correo enviado!');
      })
      .catch((error) => {
        console.log('Error al enviar correo de recuperación');
        throw error;
      });
  }

  // Login con Google
  async loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const result = await this.angularFireAuth.signInWithPopup(provider);
      if (result.user) {
        const userRef = this.angularFirestore.collection('usuarios').doc(result.user.uid);
        const userDoc = await userRef.get().toPromise();

        if (userDoc && userDoc.exists) {
          const userData = userDoc.data() as Usuario;
          if (!userData.tipo) {
            await userRef.update({ tipo: 'usuario' });
            console.log('Tipo de usuario actualizado a "usuario"');
          }
        } else {
          await userRef.set({
            email: result.user.email,
            nombre: result.user.displayName,
            tipo: 'usuario',  // Asignamos el tipo "usuario"
            uid: result.user.uid
          });
          console.log('Usuario creado con éxito');
        }

        await result.user.updateProfile({
          displayName: result.user.displayName,
          photoURL: result.user.photoURL
        });

        const userData = userDoc?.data() as Usuario || { tipo: 'usuario' };
        this.redirectUser(userData.tipo);
      }
      return result;
    } catch (error: any) {
      if (error.code === 'auth/account-exists-with-different-credential') {
        console.error("Error: Ya existe una cuenta con el mismo email.", error.message);
        throw new Error("Ya existe una cuenta con el mismo email en otro proveedor.");
      } else {
        console.error("Error en el login con Google", error.message);
        throw error;
      }
    }
  }

  // Login con GitHub
  async loginWithGitHub() {
    const provider = new firebase.auth.GithubAuthProvider();
    try {
      const result = await this.angularFireAuth.signInWithPopup(provider);
      if (result.user) {
        const userRef = this.angularFirestore.collection('usuarios').doc(result.user.uid);
        const userDoc = await userRef.get().toPromise();

        if (userDoc?.exists) {
          const userData = userDoc.data() as Usuario;
          if (!userData.tipo) {
            await userRef.update({ tipo: 'usuario' });
            console.log('Tipo de usuario actualizado a "usuario"');
          }
        } else {
          await userRef.set({
            email: result.user.email,
            nombre: result.user.displayName,
            tipo: 'usuario',
            uid: result.user.uid
          });
          console.log('Usuario creado con éxito');
        }

        await result.user.updateProfile({
          displayName: result.user.displayName,
          photoURL: result.user.photoURL
        });

        const userData = userDoc?.data() as Usuario || { tipo: 'usuario' };
        this.redirectUser(userData.tipo);
      }
      return result;
    } catch (error: any) {
      if (error.code === 'auth/account-exists-with-different-credential') {
        console.error("Error: Ya existe una cuenta con el mismo email.", error.message);
        throw new Error("Ya existe una cuenta con el mismo email en otro proveedor.");
      } else {
        console.error("Error en el login con GitHub", error.message);
        throw error;
      }
    }
  }

  // Función para redirigir al usuario según el tipo
  private redirectUser(tipo: string) {
    if (tipo === 'admin') {
      this.router.navigate(['/admin-dashboard']);
    } else if (tipo === 'usuario') {
      this.router.navigate(['/usuario-dashboard']);
    } else if (tipo === 'conductor') {
      this.router.navigate(['/conductor-dashboard']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  // Método para obtener los datos del usuario autenticado
  getUser(): Observable<firebase.User | null> {
    return this.angularFireAuth.authState;
  }

  // Método para obtener los datos del usuario desde Firestore
  getUserData(uid: string): Observable<Usuario> {
    return this.angularFirestore.collection('usuarios').doc(uid).valueChanges() as Observable<Usuario>;
  }

  // Método para obtener el tipo de usuario desde Firestore
  getUserType(uid: string): Observable<Usuario> {
    return this.angularFirestore.collection('usuarios').doc(uid).valueChanges() as Observable<Usuario>;
  }
}
