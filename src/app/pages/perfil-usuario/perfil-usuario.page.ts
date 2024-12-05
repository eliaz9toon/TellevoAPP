import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/firebase/auth.service';
import { Usuario } from '../../interfaces/usuario'; // Si tienes esta interfaz

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.page.html',
  styleUrls: ['./perfil-usuario.page.scss'],
})
export class PerfilUsuarioPage implements OnInit {
  userName: string = ''; // Almacenará el nombre de usuario
  userExtraData: Usuario | undefined; // Almacenará los datos extra del usuario
  userLanguage: string = 'Español'; // Idioma del usuario
  userTrips: number = 0; // Viajes realizados
  userRating: number = 4.5; // Calificación del usuario
  userYears: number = 2; // Años en la plataforma

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    // Obtiene el usuario actual desde el servicio de autenticación
    this.authService.getUser().subscribe((user) => {
      if (user) {
        this.userName = user.displayName || 'Usuario'; // Nombre del usuario
        // Obtener los datos adicionales desde Firestore
        this.authService.getUserData(user.uid).subscribe((data) => {
          this.userExtraData = data; // Asignar los datos a userExtraData
          console.log(this.userExtraData); // Verifica si el 'email' está presente

          // Ya no tratamos de acceder a 'language', 'trips', 'rating', y 'years' desde 'data'.
          // Usamos los valores predeterminados.
        });
      }
    });
  }
}
