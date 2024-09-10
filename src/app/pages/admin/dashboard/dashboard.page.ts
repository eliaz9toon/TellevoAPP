import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular'; // Inyecta AlertController
import { UsuariosService } from '../../../services/usuario.service';
import { Usuario } from '../../../interfaces/usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  usuarios: Usuario[] = [];
  conductores: Usuario[] = [];
  totalUsuarios: number = 0;
  totalConductores: number = 0;
  usuarioLogin?: string | null;

  // Mantener el estado del accordion
  openAccordions: { [key: string]: Usuario | null } = {
    user: null,
    conductor: null
  };

  constructor(
    private usuarioService: UsuariosService,
    private router: Router,
    private alertController: AlertController // Inyecta AlertController
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.usuarioLogin = localStorage.getItem('usuarioLogin');
    this.usuarios = this.usuarioService.getUsuarios().filter(u => u.tipo === 'usuario');
    this.conductores = this.usuarioService.getConductores();
    this.totalUsuarios = this.usuarios.length;
    this.totalConductores = this.conductores.length;

    console.log('Usuarios:', this.usuarios);
    console.log('Conductores:', this.conductores);
  }

  toggleAccordion(type: 'user' | 'conductor', item: Usuario) {
    if (this.openAccordions[type] === item) {
      this.openAccordions[type] = null;
    } else {
      this.openAccordions[type] = item;
    }
  }

  isAccordionOpen(type: 'user' | 'conductor', item: Usuario): boolean {
    return this.openAccordions[type] === item;
  }

  // Función para confirmar la eliminación de un usuario
  async confirmarEliminacionUsuario(usuario: Usuario) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro que deseas eliminar a ${usuario.email}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.eliminarUsuario(usuario.email);  // Llama a la función de eliminación si el usuario confirma
          }
        }
      ]
    });

    await alert.present();
  }

  // Función para confirmar la eliminación de un conductor
  async confirmarEliminacionConductor(conductor: Usuario) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro que deseas eliminar a ${conductor.email}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.eliminarConductor(conductor.email);  // Llama a la función de eliminación si el usuario confirma
          }
        }
      ]
    });

    await alert.present();
  }

  eliminarUsuario(email: string) {
    this.usuarioService.deleteUsuario(email);
    this.cargarDatos();
  }

  eliminarConductor(email: string) {
    this.usuarioService.deleteConductor(email);
    this.cargarDatos();
  }

  agregarUsuario() {
    console.log('Agregar Usuario');
    // Implementar acción para agregar usuario
  }

  agregarConductor() {
    console.log('Agregar Conductor');
    // Implementar acción para agregar conductor
  }

  verUsuario(usuario: Usuario) {
    console.log('Ver Usuario', usuario);
    // Redirigir a la página de perfil del usuario
    this.router.navigate(['/perfil-usuario', { email: usuario.email }]);
  }

  verConductor(conductor: Usuario) {
    console.log('Ver Conductor', conductor);
    // Redirigir a la página de perfil del conductor
    this.router.navigate(['/perfil-conductor', { email: conductor.email }]);
  }

  async cambiarTipoUsuario(usuario: Usuario) {
    this.usuarioService.updateUsuario(usuario.email, usuario);
    this.cargarDatos();

    // Mostrar alerta de confirmación
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: 'El tipo de usuario ha sido actualizado.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async guardarCambios(usuario: Usuario) {
    this.usuarioService.updateUsuario(usuario.email, usuario);
    this.cargarDatos();

    // Mostrar alerta de confirmación
    const alert = await this.alertController.create({
      header: 'Cambios Guardados',
      message: 'Los cambios han sido guardados correctamente.',
      buttons: ['OK']
    });

    await alert.present();
  }
}
