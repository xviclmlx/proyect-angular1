import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TicketsService, Ticket } from '../../services/tickets.service';
import { PermissionsService } from '../../services/permissions.service';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-mi-panel',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ButtonModule, CardModule, TagModule,
    TableModule, DialogModule, InputTextModule, TextareaModule,
    DividerModule, AvatarModule, ToastModule, SelectModule, TooltipModule,
  ],
  providers: [MessageService],
  templateUrl: './mi-panel.component.html',
  styleUrl: './mi-panel.component.css',
})
export class MiPanelComponent {
  cliente = {
    id: 0,
    nombre: '',
    usuario: '',
    email: '',
    departamento: 'Departamento TI'
  };

  dialogDetalle = false;
  dialogEditar = false;
  dialogEstado = false;

  ticketSeleccionado: Ticket | null = null;
  nuevaDescripcion = '';
  nuevoEstado = '';

  estadoOpciones = [
    { label: 'Pendiente', value: 'pendiente' },
    { label: 'En Progreso', value: 'en-progreso' },
    { label: 'Revisión', value: 'revision' },
  ];

  constructor(
    public ticketsService: TicketsService,
    public permissions: PermissionsService,
    private msg: MessageService,
  ) {
    const sesion = this.permissions.getSesionActiva()();
    if (sesion) {
      this.cliente.id = sesion.id;
      this.cliente.nombre = sesion.nombre;
      this.cliente.email = sesion.email;
      this.cliente.usuario = sesion.email.split('@')[0];
    }
    this.ticketsService.cargar();
  }

 get misTickets(): Ticket[] {
  console.log('Mi id:', this.cliente.id);
  console.log('Todos los tickets:', this.ticketsService.tickets());
  return this.ticketsService.tickets().filter(
    (t) => t.asignado_a === this.cliente.id
  );
}

  get stats() {
    const tickets = this.misTickets;
    return {
      total: tickets.length,
      pendiente: tickets.filter(t => t.estado === 'pendiente').length,
      enProgreso: tickets.filter(t => t.estado === 'en-progreso').length,
      finalizado: tickets.filter(t => t.estado === 'finalizado').length,
    };
  }

  get avatarLabel(): string {
    return this.cliente.nombre.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  verDetalle(ticket: Ticket) {
    this.ticketSeleccionado = { ...ticket };
    this.dialogDetalle = true;
  }

  abrirEditar(ticket: Ticket) {
    this.ticketSeleccionado = { ...ticket };
    this.nuevaDescripcion = ticket.descripcion;
    this.dialogEditar = true;
  }

  guardarDescripcion() {
    if (!this.nuevaDescripcion.trim()) {
      this.msg.add({ severity: 'error', summary: 'Error', detail: 'La descripción no puede estar vacía' });
      return;
    }
    const actualizado: Ticket = {
      ...this.ticketSeleccionado!,
      descripcion: this.nuevaDescripcion,
    };
    this.ticketsService.actualizar(actualizado).subscribe({
      next: () => {
        this.ticketsService.cargar();
        this.dialogEditar = false;
        this.msg.add({ severity: 'success', summary: '¡Actualizado!', detail: 'Descripción guardada correctamente' });
      },
      error: () => this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar' })
    });
  }

  abrirCambiarEstado(ticket: Ticket) {
    this.ticketSeleccionado = { ...ticket };
    this.nuevoEstado = ticket.estado;
    this.dialogEstado = true;
  }

  guardarEstado() {
    const actualizado: Ticket = {
      ...this.ticketSeleccionado!,
      estado: this.nuevoEstado as any,
    };
    this.ticketsService.actualizar(actualizado).subscribe({
      next: () => {
        this.ticketsService.cargar();
        this.dialogEstado = false;
        this.msg.add({ severity: 'success', summary: 'Estado actualizado', detail: `Ticket movido a ${this.nuevoEstado}` });
      },
      error: () => this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el estado' })
    });
  }

  finalizarTicket(ticket: Ticket) {
    const actualizado: Ticket = { ...ticket, estado: 'finalizado' };
    this.ticketsService.actualizar(actualizado).subscribe({
      next: () => {
        this.ticketsService.cargar();
        this.msg.add({ severity: 'success', summary: '¡Finalizado!', detail: 'Ticket marcado como finalizado' });
      },
      error: () => this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudo finalizar el ticket' })
    });
  }

  severidadEstado(estado: string) {
    const map: any = { pendiente: 'warn', 'en-progreso': 'info', revision: 'secondary', finalizado: 'success' };
    return map[estado] || 'info';
  }

  severidadPrioridad(prioridad: string) {
    const map: any = { baja: 'secondary', media: 'info', alta: 'warn', critica: 'danger' };
    return map[prioridad] || 'info';
  }
}