import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDropList } from '@angular/cdk/drag-drop';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TicketsService, Ticket } from '../../services/tickets.service';
import { TooltipModule } from 'primeng/tooltip';
import { AvatarModule } from 'primeng/avatar';
import { PermissionsService } from '../../services/permissions.service';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [
    CommonModule, FormsModule, DragDropModule, ButtonModule, TableModule,
    DialogModule, InputTextModule, TextareaModule, SelectModule, TagModule,
    CardModule, ToastModule, ConfirmDialogModule, DividerModule, TooltipModule, AvatarModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css',
})
export class TicketsComponent implements OnInit {
  dialogCrear = false;
  dialogDetalle = false;
  ticketSeleccionado: Ticket | null = null;
  nuevoComentario = '';
  vistaKanban = signal(false);

  usuarios: { label: string; value: number | null }[] = [];

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

  nuevoTicket = this.ticketVacio();

  constructor(
    public ticketsService: TicketsService,
    private msg: MessageService,
    private confirm: ConfirmationService,
    private permissions: PermissionsService,
    private usuariosService: UsuariosService,
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuariosService.obtenerTodos().subscribe({
      next: (data) => {
        this.usuarios = [
          { label: 'Sin asignar', value: null },
          ...data.map(u => ({ label: u.nombre, value: u.id }))
        ];
      },
      error: () => console.error('No se pudieron cargar los usuarios')
    });
  }

  get tickets() {
    return this.ticketsService.tickets();
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
      grupo_id: 1,
    };
  }

  severidadEstado(estado: string) {
    const map: any = { pendiente: 'warn', 'en-progreso': 'info', revision: 'secondary', finalizado: 'success' };
    return map[estado] || 'info';
  }

  severidadPrioridad(prioridad: string) {
    const map: any = { baja: 'secondary', media: 'info', alta: 'warn', critica: 'danger' };
    return map[prioridad] || 'info';
  }

  getTicketsPorEstado(estado: string) {
    return this.tickets.filter((t) => t.estado === estado);
  }

  onDrop(event: any, nuevoEstado: string) {
    const ticket = event.item.data as Ticket;
    if (ticket.estado !== nuevoEstado) {
      const actualizado = { ...ticket, estado: nuevoEstado as Ticket['estado'] };
      this.ticketsService.actualizar(actualizado).subscribe({
        next: () => {
          this.ticketsService.cargar();
          this.msg.add({ severity: 'success', summary: 'Movido', detail: `Ticket movido a ${nuevoEstado}` });
        }
      });
    }
  }

  abrirCrear() {
    this.nuevoTicket = this.ticketVacio();
    this.dialogCrear = true;
  }

  crearTicket() {
    if (!this.nuevoTicket.titulo) {
      this.msg.add({ severity: 'error', summary: 'Error', detail: 'El título es obligatorio' });
      return;
    }
    this.ticketsService.agregar(this.nuevoTicket).subscribe({
      next: () => {
        this.ticketsService.cargar();
        this.dialogCrear = false;
        this.msg.add({ severity: 'success', summary: 'Creado', detail: 'Ticket creado correctamente' });
      },
      error: () => this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el ticket' })
    });
  }

  verDetalle(ticket: Ticket) {
    this.ticketSeleccionado = { ...ticket };
    this.nuevoComentario = '';
    this.dialogDetalle = true;
  }

  agregarComentario() {
    if (!this.nuevoComentario.trim() || !this.ticketSeleccionado) return;
    const sesion = this.permissions.getSesionActiva()();
    const autor = sesion?.nombre || 'Anónimo';
    this.ticketsService.agregarComentario(this.ticketSeleccionado.id, autor, this.nuevoComentario).subscribe({
      next: () => {
        this.ticketsService.cargar();
        const actualizado = this.ticketsService.tickets().find(t => t.id === this.ticketSeleccionado!.id);
        if (actualizado) this.ticketSeleccionado = { ...actualizado };
        this.nuevoComentario = '';
        this.msg.add({ severity: 'success', summary: 'Comentario agregado', detail: '' });
      },
      error: () => this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudo agregar el comentario' })
    });
  }

  eliminar(ticket: Ticket) {
    this.confirm.confirm({
      message: `¿Eliminar el ticket "${ticket.titulo}"?`,
      header: 'Confirmar',
      icon: 'pi pi-trash',
      accept: () => {
        this.ticketsService.eliminar(ticket.id).subscribe({
          next: () => {
            this.ticketsService.cargar();
            this.msg.add({ severity: 'warn', summary: 'Eliminado', detail: 'Ticket eliminado' });
          },
          error: () => this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar' })
        });
      },
    });
  }
}