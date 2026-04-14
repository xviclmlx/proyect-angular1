import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Ticket {
  id: number;
  titulo: string;
  descripcion: string;
  estado: 'pendiente' | 'en-progreso' | 'revision' | 'finalizado';
  asignado_a: number | null;
  asignado_nombre: string | null;
  prioridad: 'baja' | 'media' | 'alta' | 'critica';
  fecha_creacion: string;
  fecha_limite: string;
  grupo_id: number;
  comentarios: Comentario[];
  historial: Historial[];
}

export interface Comentario {
  id: number;
  ticket_id: number;
  autor: string;
  texto: string;
  fecha: string;
}

export interface Historial {
  id: number;
  ticket_id: number;
  campo: string;
  valor_anterior: string;
  valor_nuevo: string;
  fecha: string;
  usuario: string;
}

@Injectable({ providedIn: 'root' })
export class TicketsService {
  private apiUrl = 'http://localhost:3000/api/tickets';
  private _tickets = signal<Ticket[]>([]);

  constructor(private http: HttpClient) {
    this.cargar();
  }

  get tickets() {
    return this._tickets;
  }

  cargar() {
    this.http.get<Ticket[]>(this.apiUrl).subscribe({
      next: (data) => this._tickets.set(data),
      error: (err) => console.error('Error cargando tickets', err)
    });
  }

  agregar(ticket: Omit<Ticket, 'id' | 'fecha_creacion' | 'comentarios' | 'historial' | 'asignado_nombre'>) {
    return this.http.post<Ticket>(this.apiUrl, ticket);
  }

  actualizar(ticket: Ticket) {
    return this.http.put<Ticket>(`${this.apiUrl}/${ticket.id}`, ticket);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  agregarComentario(ticketId: number, autor: string, texto: string) {
    return this.http.post(`${this.apiUrl}/${ticketId}/comentarios`, { autor, texto });
  }

  porGrupo(grupoId: number) {
    return this._tickets().filter((t) => t.grupo_id === grupoId);
  }
}