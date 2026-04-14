export interface Usuario {
  id: number;
  email: string;
  password: string;
  nombre: string;
  avatar?: string;
  permisos: string[];
  activo: boolean;
  rol?: string;
}

export interface SesionActiva {
  id: number;
  email: string;
  nombre: string;
  avatar?: string;
  permisos: string[];
}

// Lista de todos los permisos disponibles en el sistema
export const PERMISOS_DISPONIBLES = {
  DASHBOARD: 'dashboard.view',
  
  // Grupos
  GRUPOS_VER: 'grupos.view',
  GRUPOS_CREAR: 'grupos.crear',
  GRUPOS_EDITAR: 'grupos.editar',
  GRUPOS_ELIMINAR: 'grupos.eliminar',
  
  // Usuarios
  USUARIOS_VER: 'usuario.view',
  USUARIOS_CREAR: 'usuario.crear',
  USUARIOS_EDITAR: 'usuario.editar',
  USUARIOS_ELIMINAR: 'usuario.eliminar',
  
  // Tickets
  TICKETS_VER: 'tickets.view',
  TICKETS_CREAR: 'tickets.crear',
  TICKETS_EDITAR: 'tickets.editar',
  TICKETS_ELIMINAR: 'tickets.eliminar',
  
  // Panel personal
  MIPANEL_VER: 'mipanel.view',
  MIPANEL_VER_ASIGNADOS: 'ticket.ver-asignados',
  MIPANEL_EDITAR_DESCRIPCION: 'ticket.editar-descripcion',
  MIPANEL_FINALIZAR: 'ticket.finalizar',
} as const;
