import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Grupo {
  id: number;
  nombre: string;
  descripcion: string;
  nivel: string;
  miembros: {
    id: number;
    nombre: string;
    usuario: string;
    email: string;
  }[];
}

@Injectable({ providedIn: 'root' })
export class GruposService {
  private apiUrl = 'http://localhost:3000/api/grupos';
  private _grupos = signal<Grupo[]>([]);

  constructor(private http: HttpClient) {
    this.cargar();
  }

  get grupos() {
    return this._grupos;
  }

  cargar() {
    this.http.get<Grupo[]>(this.apiUrl).subscribe({
      next: (data) => this._grupos.set(data),
      error: (err) => console.error('Error cargando grupos', err)
    });
  }

  agregar(grupo: Omit<Grupo, 'id' | 'miembros'>) {
    return this.http.post<Grupo>(this.apiUrl, grupo);
  }

  actualizar(id: number, grupo: Partial<Grupo>) {
    return this.http.put<Grupo>(`${this.apiUrl}/${id}`, grupo);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  agregarMiembro(grupoId: number, userId: number) {
    return this.http.post(`${this.apiUrl}/${grupoId}/members`, { user_id: userId });
  }

  eliminarMiembro(grupoId: number, userId: number) {
    return this.http.delete(`${this.apiUrl}/${grupoId}/members/${userId}`);
  }
}