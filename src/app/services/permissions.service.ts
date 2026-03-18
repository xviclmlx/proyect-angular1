import { Injectable, signal } from '@angular/core';
import { SesionActiva } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class PermissionsService {
  private sesionActiva = signal<SesionActiva | null>(this.cargarSesion());
  private userPermissions = signal<string[]>(this.cargarPermisos());

  private cargarSesion(): SesionActiva | null {
    try {
      const sesion = sessionStorage.getItem('sesion_activa');
      if (!sesion) return null;
      return JSON.parse(sesion) as SesionActiva;
    } catch {
      sessionStorage.removeItem('sesion_activa');
      return null;
    }
  }

  private cargarPermisos(): string[] {
    const sesion = this.sesionActiva();
    return sesion ? sesion.permisos : [];
  }

  getSesionActiva() {
    return this.sesionActiva;
  }

  hasPermission(permiso: string): boolean {
    return this.userPermissions().includes(permiso);
  }

  hasAnyPermission(permisos: string[]): boolean {
    return permisos.some((p) => this.hasPermission(p));
  }

  hasAllPermissions(permisos: string[]): boolean {
    return permisos.every((p) => this.hasPermission(p));
  }

  setSesion(sesion: SesionActiva) {
    sessionStorage.setItem('sesion_activa', JSON.stringify(sesion));
    this.sesionActiva.set(sesion);
    this.userPermissions.set(sesion.permisos);
  }

  clearSession() {
    this.sesionActiva.set(null);
    this.userPermissions.set([]);
    sessionStorage.removeItem('sesion_activa');
  }

  addPermission(permiso: string) {
    this.userPermissions.update((permisos) => {
      if (!permisos.includes(permiso)) {
        return [...permisos, permiso];
      }
      return permisos;
    });
  }

  removePermission(permiso: string) {
    this.userPermissions.update((permisos) => permisos.filter((p) => p !== permiso));
  }

  isAuthenticated(): boolean {
    return this.sesionActiva() !== null;
  }
}
