import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Message } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { PermissionsService } from '../../../services/permissions.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ButtonModule, InputTextModule, FormsModule, Message, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;
  errorMsg = '';
  cargando = false;

  constructor(
    private router: Router,
    private permissions: PermissionsService,
    private http: HttpClient,
  ) {}

  login() {
    if (!this.email || !this.password) {
      this.errorMsg = 'Por favor completa todos los campos';
      return;
    }

    this.cargando = true;
    this.errorMsg = '';

    this.http.post<any>('http://localhost:3000/api/auth/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.permissions.setSesion(res.usuario);
        this.router.navigate(['/app/dashboard']);
        this.cargando = false;
      },
      error: () => {
        this.errorMsg = 'Correo o contraseña incorrectos';
        this.cargando = false;
      }
    });
  }
}