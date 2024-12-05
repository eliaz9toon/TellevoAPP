import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular'; // Importa MenuController
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/firebase/auth.service';
import { IonRouterOutlet } from '@ionic/angular'; // Asegúrate de importar IonRouterOutlet

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  usuarios: any = [];

  constructor(
    private menuController: MenuController,
    private firestore: AngularFirestore,
    private router: Router,
    private authServices: AuthService,
    private routerOutlet: IonRouterOutlet // Inyecta IonRouterOutlet
  ) { }

  ngOnInit() {
    this.menuController.enable(true);
    this.routerOutlet.swipeGesture = true; // Activa el swipeGesture solo en esta página
    this.config();
  }

  config() {
    this.firestore.collection('usuarios').valueChanges().subscribe(aux => {
      this.usuarios = aux;
    });
  }

  // FUNCION PARA NAVEGAR A OTRA PAGINA ENVIANDO EL UID DEL USER
  editarUser(uid: string) {
    this.router.navigate(['/edit-user', uid]);
  }

  logout() {
    this.authServices.logout();
    this.router.navigate(['/login']);
  }
}
