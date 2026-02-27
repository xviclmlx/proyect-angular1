import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CardModule, TagModule, DividerModule, AvatarModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent {
  perfil = {
    nombre: 'Jorge Angel Trejo Cuevas',
    usuario: 'Macabro444',
    email: 'macabrosss444@gmail.com',
    password: 'Maca@44444',
    direccion: 'Portal de Pasos 18, San Pedrito Peñuelas, Querétaro',
    telefono: '442-123-4567',
    fechaNacimiento: '2000-12-15',
  };

  get edad(): number {
    const hoy = new Date();
    const nac = new Date(this.perfil.fechaNacimiento);
    let edad = hoy.getFullYear() - nac.getFullYear();
    const m = hoy.getMonth() - nac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
    return edad;
  }
}