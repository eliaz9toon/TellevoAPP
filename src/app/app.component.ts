import { Component } from '@angular/core';
import { Page } from './interfaces/page';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages: Page[] = [];
  public tipoUsuario?:string;
  public emailUsuario?:string;
  
  constructor() {}

  ngOnInit() {
    const usuario = localStorage.getItem('usuarioLogin');

    if (usuario) {
      const aux = JSON.parse(usuario);
      this.tipoUsuario = aux.tipo;
      this.emailUsuario = aux.email;
      this.configSideMenu();
    } else {
      // TODO: redireccionar al login
    }
  }

  configSideMenu() {
    if (this.tipoUsuario === 'admin') {
      this.appPages = [
        {title:'Inicio',url:'/admin-dashboard',icon:'home'},
        {title: 'Ver Perfil', url: '/perfil-admin', icon: 'person'}, 
        {title:'Administración Usuarios',url:'/admin-users',icon:'people'},
        {title:'Ver Solicitudes',url:'/confirmar-formulario',icon:'document-text'},
        {title:'Cerrar Sesión',url:'/login',icon:'log-out'},
       
      ]
    } else if (this.tipoUsuario === 'usuario') {
      this.appPages = [
        {title:'Inicio',url:'/usuario-dashboard',icon:'home'},
        {title:'Perfil',url:'/perfil-usuario',icon:'person'},
        {title:'Reportar',url:'/reporte',icon:'document'},
        {title:'Quiero ser conductor',url:'/formulario-conductor',icon:'car'},
        {title:'Cerrar Sesión',url:'/login',icon:'log-out'},
      ]
    } else if (this.tipoUsuario === 'conductor') {
      this.appPages = [
        {title:'Inicio',url:'/user-dashboard',icon:'home'},
        {title:'Perfil',url:'/perfil-conductor',icon:'person'},
        {title:'Cerrar Sesión',url:'/login',icon:'log-out'},
      ]
    } else {
      this.appPages = [
        {title:'Login',url:'/login',icon:'log-in'},
        {title:'Registrarse',url:'/register',icon:'create'},
      ]
    }
  }

}