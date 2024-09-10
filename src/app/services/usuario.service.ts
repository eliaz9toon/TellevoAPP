import { Injectable } from '@angular/core';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  usuarios: Usuario[] = [
    { 'email': 'admin@admin.cl', 'pass': 'admin123', 'tipo': 'admin' },
    { 'email': 'user@user.cl', 'pass': 'user123', 'tipo': 'usuario' },
    { 'email': 'invi@invi.cl', 'pass': 'invitado123', 'tipo': 'invitado' },
    { 'email': 'conductor@conductor.cl', 'pass': 'conductor123', 'tipo': 'conductor' },
  ];

  constructor() {}

  getUsuarios(): Usuario[] {
    return this.usuarios;
  }

  getUsuarioByEmail(email: string): Usuario | undefined {
    return this.usuarios.find(user => user.email === email);
  }

  addUsuario(usuario: Usuario): void {
    this.usuarios.push(usuario);
  }

  deleteUsuario(email: string): void {
    this.usuarios = this.usuarios.filter(user => user.email !== email);
  }

  updateUsuario(email: string, newData: Usuario): void {
    const userIndex = this.usuarios.findIndex(user => user.email === email);
    if (userIndex !== -1) {
      this.usuarios[userIndex] = newData;
    }
  }

  getTotalUsuarios(): number {
    return this.usuarios.length;
  }

  getConductores(): Usuario[] {
    return this.usuarios.filter(user => user.tipo === 'conductor');
  }

  addConductor(conductor: Usuario): void {
    conductor.tipo = 'conductor';
    this.usuarios.push(conductor);
  }

  deleteConductor(email: string): void {
    this.usuarios = this.usuarios.filter(user => !(user.email === email && user.tipo === 'conductor'));
  }

  updatePassword(email: string, newPassword: string): void {
    const user = this.getUsuarioByEmail(email);
    if (user) {
      user.pass = newPassword;
    }
  }
}
