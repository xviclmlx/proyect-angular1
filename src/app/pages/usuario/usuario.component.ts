import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Message } from 'primeng/message';
import { HasPermissionDirective } from '../../directives/has-permission.directive';
import { PermissionsService } from '../../services/permissions.service';

// 🔥 INTERFAZ (CLAVE PARA EL ERROR)
interface Perfil {
  nombre: string;
  usuario: string;
  email: string;
  telefono: string;
  direccion: string;
  fechaNacimiento: string;
  rol: string;
}

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    CardModule,
    TagModule,
    DividerModule,
    AvatarModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    ToastModule,
    ConfirmDialogModule,
    CommonModule,
    Message,
    HasPermissionDirective,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css',
})
export class UsuarioComponent {

  dialogVisible = false;

  // ✅ YA TIPADO (NUNCA será undefined)
  perfil: Perfil = {
    nombre: 'Victor Antonio Gudiño Velazco',
    usuario: 'Viclml',
    email: 'viclml@gmail.com',
    telefono: '4426088640',
    direccion: 'Querétaro, México',
    fechaNacimiento: '2000-11-12',
    rol: 'Administrador',
  };

  perfilEdicion: Perfil = { ...this.perfil };

  constructor(
    private msg: MessageService,
    private confirm: ConfirmationService,
    private router: Router,
    private permissions: PermissionsService,
  ) {
    const sesion = this.permissions.getSesionActiva()();
    if (sesion) {
      this.perfil.nombre = sesion.nombre;
      this.perfil.email = sesion.email;
      this.perfil.usuario = sesion.email.split('@')[0];
    }
  }

  // ===============================
  // GETTERS
  // ===============================

  get edad(): number {
    const hoy = new Date();
    const nac = new Date(this.perfil.fechaNacimiento);
    let edad = hoy.getFullYear() - nac.getFullYear();
    const m = hoy.getMonth() - nac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
    return edad;
  }

  get maxFechaNacimiento(): string {
    const hoy = new Date();
    hoy.setFullYear(hoy.getFullYear() - 18);
    return hoy.toISOString().split('T')[0];
  }

  get avatarLabel(): string {
    return this.perfil.nombre
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

  // ===============================
  // INPUT SOLO NÚMEROS
  // ===============================

  soloNumeros(event: KeyboardEvent) {
    const tecla = event.key;

    if (
      tecla === 'Backspace' ||
      tecla === 'Delete' ||
      tecla === 'ArrowLeft' ||
      tecla === 'ArrowRight'
    ) {
      return;
    }

    if (!/^[0-9]$/.test(tecla)) {
      event.preventDefault();
    }
  }

  // ===============================
  // ACCIONES
  // ===============================

  abrirEdicion() {
    this.perfilEdicion = { ...this.perfil };
    this.dialogVisible = true;
  }

  guardar() {
    if (!this.perfilEdicion.nombre || !this.perfilEdicion.email) {
      this.msg.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Nombre y email son obligatorios',
      });
      return;
    }

    if (!this.perfilEdicion.email.includes('@')) {
      this.msg.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El email debe contener @'
      });
      return;
    }

    // 🔥 VALIDACIÓN SEGURA
    if (!this.perfilEdicion.telefono || this.perfilEdicion.telefono.length !== 10) {
      this.msg.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El teléfono debe tener exactamente 10 dígitos',
      });
      return;
    }

    const nac = new Date(this.perfilEdicion.fechaNacimiento);
    const hoy = new Date();
    let edadCalc = hoy.getFullYear() - nac.getFullYear();
    const m = hoy.getMonth() - nac.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edadCalc--;

    if (edadCalc < 18) {
      this.msg.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debes ser mayor de 18 años'
      });
      return;
    }

    this.perfil = { ...this.perfilEdicion };
    this.dialogVisible = false;

    this.msg.add({
      severity: 'success',
      summary: '¡Actualizado!',
      detail: 'Perfil actualizado correctamente',
    });
  }

  eliminarCuenta() {
    this.confirm.confirm({
      message: '¿Estás seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer.',
      header: 'Eliminar cuenta',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.msg.add({
          severity: 'warn',
          summary: 'Cuenta eliminada',
          detail: 'Redirigiendo...'
        });

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
    });
  }
}