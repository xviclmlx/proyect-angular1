import { Component, signal } from '@angular/core';
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
import { UsuariosService } from '../../services/usuarios.service';
import { PERMISOS_DISPONIBLES, Usuario } from '../../models/user.model';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    CardModule, TagModule, DividerModule, AvatarModule, ButtonModule,
    DialogModule, InputTextModule, FormsModule, ToastModule,
    ConfirmDialogModule, CommonModule, Message, HasPermissionDirective,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css',
})
export class UsuarioComponent {
  dialogVisible = false;
  usuarios = signal<Usuario[]>([]);
  usuarioModalVisible = false;
  usuarioSeleccionado: Usuario | null = null;

  permisosList = Object.values(PERMISOS_DISPONIBLES);
  permisoLabels: Record<string, string> = {
    [PERMISOS_DISPONIBLES.DASHBOARD]: 'Dashboard',
    [PERMISOS_DISPONIBLES.GRUPOS_VER]: 'Ver Grupos',
    [PERMISOS_DISPONIBLES.GRUPOS_CREAR]: 'Crear Grupos',
    [PERMISOS_DISPONIBLES.GRUPOS_EDITAR]: 'Editar Grupos',
    [PERMISOS_DISPONIBLES.GRUPOS_ELIMINAR]: 'Eliminar Grupos',
    [PERMISOS_DISPONIBLES.USUARIOS_VER]: 'Ver Usuarios',
    [PERMISOS_DISPONIBLES.USUARIOS_CREAR]: 'Crear Usuarios',
    [PERMISOS_DISPONIBLES.USUARIOS_EDITAR]: 'Editar Usuarios',
    [PERMISOS_DISPONIBLES.USUARIOS_ELIMINAR]: 'Eliminar Usuarios',
    [PERMISOS_DISPONIBLES.TICKETS_VER]: 'Ver Tickets',
    [PERMISOS_DISPONIBLES.TICKETS_CREAR]: 'Crear Tickets',
    [PERMISOS_DISPONIBLES.TICKETS_EDITAR]: 'Editar Tickets',
    [PERMISOS_DISPONIBLES.TICKETS_ELIMINAR]: 'Eliminar Tickets',
    [PERMISOS_DISPONIBLES.MIPANEL_VER]: 'Ver Mi Panel',
    [PERMISOS_DISPONIBLES.MIPANEL_VER_ASIGNADOS]: 'Ver Asignados',
    [PERMISOS_DISPONIBLES.MIPANEL_EDITAR_DESCRIPCION]: 'Editar Descripción',
    [PERMISOS_DISPONIBLES.MIPANEL_FINALIZAR]: 'Finalizar',
  };

  perfil = {
    id: 0,
    nombre: '',
    usuario: '',
    email: '',
    password: '',
    telefono: '0000000000',
    direccion: 'Querétaro, México',
    fechaNacimiento: '2000-11-12',
    rol: '',
  };

  perfilEdicion = { ...this.perfil };

  constructor(
    private msg: MessageService,
    private confirm: ConfirmationService,
    private router: Router,
    public permissions: PermissionsService,
    private usuariosService: UsuariosService,
  ) {
    const sesion = this.permissions.getSesionActiva()();
    if (sesion) {
      this.perfil.id = sesion.id;
      this.perfil.nombre = sesion.nombre;
      this.perfil.email = sesion.email;
      this.perfil.usuario = sesion.email.split('@')[0];
      this.perfil.rol = (sesion as any).rol || '';
    }
    this.cargarUsuarios();
  }

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

  soloNumeros(event: KeyboardEvent) {
    if (!/[0-9]/.test(event.key)) event.preventDefault();
  }

  abrirEdicion() {
    this.perfilEdicion = { ...this.perfil };
    this.dialogVisible = true;
  }

  guardar() {
    if (!this.perfilEdicion.nombre || !this.perfilEdicion.email) {
      this.msg.add({ severity: 'error', summary: 'Error', detail: 'Nombre y email son obligatorios' });
      return;
    }
    if (!this.perfilEdicion.email.includes('@')) {
      this.msg.add({ severity: 'error', summary: 'Error', detail: 'El email debe contener @' });
      return;
    }
    if (this.perfilEdicion.telefono.length !== 10) {
      this.msg.add({ severity: 'error', summary: 'Error', detail: 'El teléfono debe tener exactamente 10 dígitos' });
      return;
    }

    this.usuariosService.actualizarPerfil(this.perfil.id, {
      nombre: this.perfilEdicion.nombre,
      email: this.perfilEdicion.email,
      password: this.perfilEdicion.password,
      telefono: this.perfilEdicion.telefono,
      direccion: this.perfilEdicion.direccion,
      fechaNacimiento: this.perfilEdicion.fechaNacimiento,
    }).subscribe({
      next: () => {
        this.perfil = { ...this.perfilEdicion };
        this.dialogVisible = false;
        this.msg.add({ severity: 'success', summary: '¡Actualizado!', detail: 'Perfil actualizado correctamente' });

        // Actualizar sesión activa con nuevo nombre/email
        const sesionActual = this.permissions.getSesionActiva()();
        if (sesionActual) {
          this.permissions.setSesion({
            ...sesionActual,
            nombre: this.perfilEdicion.nombre,
            email: this.perfilEdicion.email,
          });
        }
      },
      error: () => this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el perfil' })
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
        this.msg.add({ severity: 'warn', summary: 'Cuenta eliminada', detail: 'Redirigiendo...' });
        setTimeout(() => this.router.navigate(['/']), 2000);
      },
    });
  }

  cargarUsuarios() {
    this.usuariosService.obtenerTodos().subscribe({
      next: (data) => this.usuarios.set(data),
      error: () => this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los usuarios' })
    });
  }

  abrirModalUsuario(usuario: Usuario) {
    this.usuarioSeleccionado = { ...usuario };
    this.usuarioModalVisible = true;
  }

  togglePermisoUsuario(permiso: string, estado: boolean) {
    if (!this.permissions.hasPermission(PERMISOS_DISPONIBLES.USUARIOS_EDITAR)) {
      this.msg.add({ severity: 'warn', summary: 'Sin permiso', detail: 'No tienes permisos para editar usuarios' });
      return;
    }
    if (!this.usuarioSeleccionado) return;

    const nuevosPermisos = estado
      ? Array.from(new Set([...(this.usuarioSeleccionado.permisos || []), permiso]))
      : (this.usuarioSeleccionado.permisos || []).filter(p => p !== permiso);

    this.usuariosService.actualizarPermisos(this.usuarioSeleccionado.id, nuevosPermisos).subscribe({
      next: () => {
        this.usuarioSeleccionado!.permisos = nuevosPermisos;
        this.cargarUsuarios();
        const sesionActual = this.permissions.getSesionActiva()();
        if (sesionActual?.id === this.usuarioSeleccionado!.id) {
          this.permissions.setSesion({ ...sesionActual, permisos: nuevosPermisos });
        }
      },
      error: () => this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron actualizar los permisos' })
    });
  }
}