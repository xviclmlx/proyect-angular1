import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

interface Grupo {
  id: number;
  nombre: string;
  descripcion: string;
  nivel: string;
  integrantes: number;
  tickets: number;
}

@Component({
  selector: 'app-grupos',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, TableModule, DialogModule, InputTextModule, TagModule, CardModule, ToastModule, ConfirmDialogModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './grupos.component.html',
  styleUrl: './grupos.component.css'
})
export class GruposComponent {
  grupos: Grupo[] = [
    { id: 1, nombre: 'Seguridad', descripcion: 'Seguridad en Apps', nivel: 'Avanzado', integrantes: 5, tickets: 2 },
    { id: 2, nombre: 'Frontend', descripcion: 'Desarrollo UI', nivel: 'Básico', integrantes: 3, tickets: 0 },
  ];

  dialogVisible = false;
  esEdicion = false;
  grupoActual: Grupo = this.grupoVacio();

  constructor(private msg: MessageService, private confirm: ConfirmationService) {}

  grupoVacio(): Grupo {
    return { id: 0, nombre: '', descripcion: '', nivel: '', integrantes: 0, tickets: 0 };
  }

  abrirNuevo() {
    this.grupoActual = this.grupoVacio();
    this.esEdicion = false;
    this.dialogVisible = true;
  }

  editar(grupo: Grupo) {
    this.grupoActual = { ...grupo };
    this.esEdicion = true;
    this.dialogVisible = true;
  }

  guardar() {
    if (!this.grupoActual.nombre) {
      this.msg.add({ severity: 'error', summary: 'Error', detail: 'El nombre es obligatorio' });
      return;
    }
    if (this.esEdicion) {
      const i = this.grupos.findIndex(g => g.id === this.grupoActual.id);
      this.grupos[i] = { ...this.grupoActual };
      this.msg.add({ severity: 'success', summary: 'Actualizado', detail: 'Grupo actualizado correctamente' });
    } else {
      this.grupoActual.id = this.grupos.length + 1;
      this.grupos = [...this.grupos, { ...this.grupoActual }];
      this.msg.add({ severity: 'success', summary: 'Creado', detail: 'Grupo creado correctamente' });
    }
    this.dialogVisible = false;
  }

  eliminar(grupo: Grupo) {
    this.confirm.confirm({
      message: `¿Deseas eliminar el grupo "${grupo.nombre}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-trash',
      accept: () => {
        this.grupos = this.grupos.filter(g => g.id !== grupo.id);
        this.msg.add({ severity: 'warn', summary: 'Eliminado', detail: 'Grupo eliminado' });
      }
    });
  }
}