import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-grupos',
  standalone: true,
  imports: [CardModule, TagModule],
  templateUrl: './grupos.component.html',
  styleUrl: './grupos.component.css'
})
export class GruposComponent {
  grupos = [
    { nombre: 'Seguridad', materia: 'Seguridad en Aplicaciones', alumnos: 27, semestre: '8vo' },
  ];
}