import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { MessageService, ConfirmationService } from 'primeng/api';
import { GrupoStateService } from '../../services/grupo-state';
import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { TicketsService } from '../../services/tickets.service';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { HasPermissionDirective } from '../../directives/has-permission.directive';
import { PermissionsService } from '../../services/permissions.service';
import { GruposService, Grupo } from '../../services/grupos.service';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../models/user.model';

interface Miembro {
  id: number;
  nombre: string;
  email: string;
}

@Component({
  selector: 'app-grupos',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ButtonModule, TableModule, DialogModule,
    InputTextModule, TagModule, CardModule, ToastModule, ConfirmDialogModule,
    AvatarModule, DividerModule, SelectModule, TextareaModule, HasPermissionDirective,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './grupos.component.html',
  styleUrl: './grupos.component.css',
})
export class GruposComponent implements OnInit {
  grupos: Grupo[] = [];
  usuariosDisponibles: Usuario[] = [];
  usuariosOpciones: { label: string; value: number | null }[] = [];

  dialogGrupo = false;
  dialogMiembros = false;
  esEdicion = false;
  grupoActual: Grupo = this.grupoVacio();
  grupoDetalle: Grupo | null = null;
  busquedaMiembro = '';
  grupoFiltrado: number | null = null;

  dialogTicket = false;
  grupoTicket: Grupo | null = null;
  nuevoTicket = this.ticketVacio();

  estadoOpciones = [
    { label: 'Pendiente', value: 'pendiente' },
    { label: 'En Progreso', value: 'en-progreso' },
    { label: 'Revisión', value: 'revision' },
    { label: 'Finalizado', value: 'finalizado' },
  ];

  prioridadOpciones = [
    { label: 'Baja', value: 'baja' },
    { label: 'Media', value: 'media' },
    { label: 'Alta', value: 'alta' },
    { label: 'Crítica', value: 'critica' },
  ];

  constructor(
    private msg: MessageService,
    private confirm: ConfirmationService,
    private grupoState: GrupoStateService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    public ticketsService: TicketsService,
    public permissions: PermissionsService,
    private gruposService: GruposService,
    private usuariosService: UsuariosService,
  ) {}

  ngOnInit() {
    this.cargarGrupos();
    this.cargarUsuarios();

    this.grupoFiltrado = this.grupoState.grupoSeleccionado();
    if (this.grupoFiltrado !== null) {
      const grupo = this.grupos.find(g => g.id === this.grupoFiltrado);
      if (grupo) this.verMiembros(grupo);
      this.grupoState.grupoSeleccionado.set(null);
    }
  }

  cargarGrupos() {
    this.gruposService.cargar();
    const interval = setInterval(() => {
      const data = this.gruposService.grupos();
      if (data.length >= 0) {
        this.grupos = data;
        this.cdr.detectChanges();
        clearInterval(interval);
      }
    }, 200);
  }

  cargarUsuarios() {
    this.usuariosService.obtenerTodos().subscribe({
      next: (data) => {
        this.usuariosDisponibles = data;
        this.usuariosOpciones = [
          { label: 'Sin asignar', value: null },
          ...data.map(u => ({ label: u.nombre, value: u.id }))
        ];
      },
      error: () => this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los usuarios' })
    });
  }

  grupoVacio(): Grupo {
    return { id: 0, nombre: '', descripcion: '', nivel: '', miembros: [] };
  }

  get minFecha(): string {
    return new Date().toISOString().split('T')[0];
  }

  ticketVacio() {
    return {
      titulo: '',
      descripcion: '',
      estado: 'pendiente' as const,
      asignado_a: null as number | null,
      prioridad: 'media' as const,
      fecha_limite: '',
      grupo_id: 0,
    };
  }

  abrirNuevo() {
    this.grupoActual = this.grupoVacio();
    this.esEdicion = false;
    this.dialogGrupo = true;
  }

  editar(grupo: Grupo) {
    this.grupoActual = { ...grupo };
    this.esEdicion = true;
    this.dialogGrupo = true;
  }

  guardar() {
    if (!this.grupoActual.nombre) {
      this.msg.add({ severity: 'error', summary: 'Error', detail: 'El nombre es obligatorio' });
      return;
    }
    if (this.esEdicion) {
      this.gruposService.actualizar(this.grupoActual.id, {
        nombre: this.grupoActual.nombre,
        descripcion: this.grupoActual.descripcion,
        nivel: this.grupoActual.nivel
      }).subscribe({
        next: () => {
          this.recargarGrupos();
          this.dialogGrupo = false;
          this.msg.add({ severity: 'success', summary: 'Actualizado', detail: 'Grupo actualizado' });
        },
        error: () => this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el grupo' })
      });
    } else {
      this.gruposService.agregar({
        nombre: this.grupoActual.nombre,
        descripcion: this.grupoActual.descripcion,
        nivel: this.grupoActual.nivel
      }).subscribe({
        next: () => {
          this.recargarGrupos();
          this.dialogGrupo = false;
          this.msg.add({ severity: 'success', summary: 'Creado', detail: 'Grupo creado' });
        },
        error: () => this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el grupo' })
      });
    }
  }

  eliminarGrupo(grupo: Grupo) {
    this.confirm.confirm({
      message: `¿Eliminar el grupo "${grupo.nombre}"?`,
      header: 'Confirmar',
      icon: 'pi pi-trash',
      accept: () => {
        this.gruposService.eliminar(grupo.id).subscribe({
          next: () => {
            this.zone.run(() => {
              this.recargarGrupos();
              this.msg.add({ severity: 'warn', summary: 'Eliminado', detail: 'Grupo eliminado' });
            });
          },
          error: () => this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el grupo' })
        });
      },
    });
  }

  recargarGrupos() {
    this.gruposService.cargar();
    setTimeout(() => {
      this.grupos = this.gruposService.grupos();
      this.cdr.detectChanges();
    }, 400);
  }

  verMiembros(grupo: Grupo) {
    this.grupoDetalle = grupo;
    this.busquedaMiembro = '';
    this.dialogMiembros = true;
  }

  get usuariosFiltrados(): Usuario[] {
    if (!this.busquedaMiembro) return this.usuariosDisponibles;
    const b = this.busquedaMiembro.toLowerCase();
    return this.usuariosDisponibles.filter(u =>
      u.nombre.toLowerCase().includes(b) ||
      u.email.toLowerCase().includes(b)
    );
  }

  esMiembro(usuario: Usuario): boolean {
    return this.grupoDetalle?.miembros.some(m => m.id === usuario.id) ?? false;
  }

  agregarMiembro(usuario: Usuario) {
    if (!this.grupoDetalle || this.esMiembro(usuario)) return;
    this.gruposService.agregarMiembro(this.grupoDetalle.id, usuario.id).subscribe({
      next: () => {
        this.recargarGrupos();
        this.msg.add({ severity: 'success', summary: 'Agregado', detail: `${usuario.nombre} agregado al grupo` });
      },
      error: () => this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudo agregar el miembro' })
    });
  }

  eliminarMiembro(miembro: any) {
    if (!this.grupoDetalle) return;
    this.confirm.confirm({
      message: `¿Eliminar a "${miembro.nombre}" del grupo?`,
      header: 'Confirmar',
      icon: 'pi pi-user-minus',
      accept: () => {
        this.gruposService.eliminarMiembro(this.grupoDetalle!.id, miembro.id).subscribe({
          next: () => {
            this.recargarGrupos();
            this.msg.add({ severity: 'warn', summary: 'Eliminado', detail: `${miembro.nombre} eliminado del grupo` });
          },
          error: () => this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el miembro' })
        });
      }
    });
  }

  abrirCrearTicket(grupo: Grupo) {
    this.grupoTicket = grupo;
    this.nuevoTicket = { ...this.ticketVacio(), grupo_id: grupo.id };
    this.dialogTicket = true;
  }

  crearTicket() {
    if (!this.nuevoTicket.titulo) {
      this.msg.add({ severity: 'error', summary: 'Error', detail: 'El título es obligatorio' });
      return;
    }
    this.ticketsService.agregar(this.nuevoTicket).subscribe({
      next: () => {
        this.ticketsService.cargar();
        this.dialogTicket = false;
        this.msg.add({ severity: 'success', summary: 'Creado', detail: 'Ticket creado correctamente' });
      },
      error: () => this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el ticket' })
    });
  }

  getNombreMiembro(userId: number): string {
    const usuario = this.usuariosDisponibles.find(u => u.id === userId);
    return usuario ? usuario.nombre : `Usuario ${userId}`;
  }

  getTicketsDelGrupo(grupoId: number): number {
    return this.ticketsService.tickets().filter(t => t.grupo_id === grupoId).length;
  }
}