import { Component, OnInit } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Page } from './interfaces/page';
import { AuthService } from './services/firebase/auth.service';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages: Page[] = [{ title: 'Cargando...', url: '/loading', icon: 'time' }];
  public tipoUsuario?: string;
  public emailUsuario?: string;
  public nombreUsuario?: string;

  constructor(
    private menuController: MenuController,
    private router: Router,
    private platform: Platform,
    private authService: AuthService
  ) {
    // Deshabilitar el gesto de swipe inicialmente
    this.menuController.swipeGesture(false);
  }

  ngOnInit() {
    this.initializeApp();
  }

  private initializeApp() {
    this.loadUserData();

    this.platform.backButton.subscribeWithPriority(10, () => {
      // Evitar volver a la pantalla de login
      if (this.router.url === '/login') {
        return;
      } else {
        this.router.navigate(['/login']);
      }
    });

    // Estado inicial del menú lateral
    this.menuController.enable(false);
  }

  private loadUserData() {
    this.authService
      .getUser()
      .pipe(
        switchMap((user) => {
          if (user) {
            this.emailUsuario = user.email || '';
            this.nombreUsuario = user.displayName || 'Usuario';

            // Intentar obtener el tipo de usuario
            return this.authService.getUserType(user.uid).pipe(
              catchError(() => of({ tipo: '' })) // En caso de error, devolver un tipo vacío
            );
          }
          return of({ tipo: '' }); // Si no hay usuario, devolver un tipo vacío
        }),
        catchError(() => of({ tipo: '' })) // Manejo general de errores
      )
      .subscribe((userData) => {
        this.tipoUsuario = userData.tipo || '';
        this.configSideMenu();
        this.menuController.enable(!!this.tipoUsuario); // Habilitar menú si hay un tipo válido
      });
  }

  private configSideMenu() {
    switch (this.tipoUsuario) {
      case 'admin':
        this.appPages = [
          { title: 'Administración Usuarios', url: '/admin-dashboard', icon: 'people' },
          { title: 'Ver Perfil', url: '/perfil-admin', icon: 'person' },
          { title: 'Ver Solicitudes', url: '/confirmar-formulario', icon: 'document-text' },
        ];
        break;

      case 'usuario':
        this.appPages = [
          { title: 'Viajes', url: '/usuario-dashboard', icon: 'car' },
          { title: 'Perfil', url: '/perfil-usuario', icon: 'person' },
          { title: 'Reportar', url: '/reporte', icon: 'document' },
          { title: 'Quiero ser conductor', url: '/formulario-conductor', icon: 'car' },
        ];
        break;

      case 'conductor':
        this.appPages = [
          { title: 'Perfil', url: '/perfil-conductor', icon: 'person' },
          { title: 'Crear Viaje', url: '/mapa', icon: 'car' },
        ];
        break;

      default:
        this.appPages = [
          { title: 'Login', url: '/login', icon: 'log-in' },
          { title: 'Registrarse', url: '/register', icon: 'create' },
        ];
        break;
    }
  }

  goToPage(url: string) {
    this.menuController.close();

    if (this.router.url !== url) {
      this.router.navigate([url]);
    } else {
      this.router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() => {
        this.router.navigate([url]);
      });
    }
  }

  cerrarSesion() {
    this.menuController.close();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
