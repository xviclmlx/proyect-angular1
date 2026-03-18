import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { PermissionsService } from '../../services/permissions.service';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { PERMISOS_DISPONIBLES } from '../../models/user.model';

interface MenuItem {
  label: string;
  icon: string;
  ruta: string;
  permisoRequerido: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  nombreUsuario = signal('');
  avatarUsuario = signal('👤');
  sidebarAbierto = signal(true);

  menuItems: MenuItem[] = [
    {
      label: 'Inicio',
      icon: 'pi-home',
      ruta: '/app/dashboard',
      permisoRequerido: PERMISOS_DISPONIBLES.DASHBOARD,
    },
    {
      label: 'Grupos',
      icon: 'pi-users',
      ruta: '/app/grupos',
      permisoRequerido: PERMISOS_DISPONIBLES.GRUPOS_VER,
    },
    {
      label: 'Usuarios',
      icon: 'pi-id-card',
      ruta: '/app/usuario',
      permisoRequerido: PERMISOS_DISPONIBLES.USUARIOS_VER,
    },
    {
      label: 'Mi Panel',
      icon: 'pi-briefcase',
      ruta: '/app/mi-panel',
      permisoRequerido: PERMISOS_DISPONIBLES.MIPANEL_VER,
    },
  ];

  constructor(
    private permissions: PermissionsService,
    private router: Router,
    private confirmationService: ConfirmationService,
  ) {
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario() {
    const sesion = this.permissions.getSesionActiva();
    if (sesion()) {
      this.nombreUsuario.set(sesion()!.nombre);
      this.avatarUsuario.set(sesion()!.avatar || '👤');
    }
  }

  toggleSidebar() {
    this.sidebarAbierto.update((v) => !v);
  }

  tienePermiso(permiso: string): boolean {
    return this.permissions.hasPermission(permiso);
  }

  cerrarSesion(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Deseas cerrar sesión?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.permissions.clearSession();
        this.router.navigate(['/']);
      },
    });
  }
}