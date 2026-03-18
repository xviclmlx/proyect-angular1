import { Injectable } from '@angular/core';
import { Usuario, SesionActiva, PERMISOS_DISPONIBLES } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  // Base de datos de usuarios (en producción esto vendría de un backend)
  private usuarios: Usuario[] = [
    {
      id: 1,
      email: 'vic@gmail.com',
      password: '1234',
      nombre: 'Víctor García',
      avatar: '🧑‍💼',
      permisos: [
        PERMISOS_DISPONIBLES.DASHBOARD,
        PERMISOS_DISPONIBLES.GRUPOS_VER,
        PERMISOS_DISPONIBLES.GRUPOS_CREAR,
        PERMISOS_DISPONIBLES.GRUPOS_EDITAR,
        PERMISOS_DISPONIBLES.GRUPOS_ELIMINAR,
        PERMISOS_DISPONIBLES.USUARIOS_VER,
        PERMISOS_DISPONIBLES.USUARIOS_CREAR,
        PERMISOS_DISPONIBLES.USUARIOS_EDITAR,
        PERMISOS_DISPONIBLES.USUARIOS_ELIMINAR,
        PERMISOS_DISPONIBLES.TICKETS_VER,
        PERMISOS_DISPONIBLES.TICKETS_CREAR,
        PERMISOS_DISPONIBLES.TICKETS_EDITAR,
        PERMISOS_DISPONIBLES.TICKETS_ELIMINAR,
      ],
      activo: true,
    },
    {
      id: 2,
      email: 'user@gmail.com',
      password: '12345',
      nombre: 'Emma Martínez',
      avatar: '👩‍💼',
      permisos: [
        PERMISOS_DISPONIBLES.DASHBOARD,
        PERMISOS_DISPONIBLES.MIPANEL_VER,
        PERMISOS_DISPONIBLES.MIPANEL_VER_ASIGNADOS,
        PERMISOS_DISPONIBLES.MIPANEL_EDITAR_DESCRIPCION,
        PERMISOS_DISPONIBLES.MIPANEL_FINALIZAR,
      ],
      activo: true,
    },
    {
      id: 3,
      email: 'soporte@gmail.com',
      password: 'Soporte123',
      nombre: 'Soporte Técnico',
      avatar: '👨‍💻',
      permisos: [
        PERMISOS_DISPONIBLES.DASHBOARD,
        PERMISOS_DISPONIBLES.TICKETS_VER,
        PERMISOS_DISPONIBLES.TICKETS_CREAR,
        PERMISOS_DISPONIBLES.TICKETS_EDITAR,
        PERMISOS_DISPONIBLES.USUARIOS_VER,
      ],
      activo: true,
    },
  ];

  autenticar(email: string, password: string): SesionActiva | null {
    const usuario = this.usuarios.find(
      (u) => u.email === email && u.password === password && u.activo
    );

    if (usuario) {
      const sesion: SesionActiva = {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        avatar: usuario.avatar,
        permisos: usuario.permisos,
      };
      return sesion;
    }

    return null;
  }

  obtenerUsuario(id: number): Usuario | undefined {
    return this.usuarios.find((u) => u.id === id);
  }

  obtenerTodos(): Usuario[] {
    return this.usuarios;
  }

  crear(usuario: Omit<Usuario, 'id'>): Usuario {
    const nuevoUsuario: Usuario = {
      ...usuario,
      id: Math.max(0, ...this.usuarios.map((u) => u.id)) + 1,
    };
    this.usuarios.push(nuevoUsuario);
    return nuevoUsuario;
  }

  actualizar(id: number, datos: Partial<Usuario>): Usuario | null {
    const usuario = this.usuarios.find((u) => u.id === id);
    if (usuario) {
      Object.assign(usuario, datos);
      return usuario;
    }
    return null;
  }

  eliminar(id: number): boolean {
    const index = this.usuarios.findIndex((u) => u.id === id);
    if (index > -1) {
      this.usuarios.splice(index, 1);
      return true;
    }
    return false;
  }
}
