import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  obtenerUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  actualizarPerfil(id: number, datos: {
    nombre: string;
    email: string;
    password?: string;
    telefono?: string;
    direccion?: string;
    fechaNacimiento?: string;
  }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/perfil`, datos);
  }

  actualizarPermisos(id: number, permisos: string[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/permisos`, { permisos });
  }
}