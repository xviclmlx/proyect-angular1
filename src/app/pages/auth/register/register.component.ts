import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ButtonModule, InputTextModule, FormsModule, ReactiveFormsModule, MessageModule, CommonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './register.component.html',
  styles: [
    `
    .register-root {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2.5rem 1.5rem;
      background: radial-gradient(circle at top, rgba(99, 179, 237, 0.25), rgba(15, 23, 42, 0.92));
      color: #f9fafb;
    }

    .register-card {
      width: 420px;
      padding: 2.2rem 2.3rem;
      border-radius: 22px;
      background: rgba(15, 23, 42, 0.72);
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55);
      backdrop-filter: blur(18px);
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
    }

    .register-title {
      text-align: center;
      font-size: 1.9rem;
      letter-spacing: 0.03em;
      margin: 0;
      background: linear-gradient(90deg, rgba(99, 179, 237, 1), rgba(236, 72, 153, 1));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .fields {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .field {
      opacity: 0;
      transform: translateZ(220px) rotateX(15deg);
      animation: flyFromScreen 0.9s ease-out forwards;
      animation-delay: var(--delay, 0s);
    }

    .field-input {
      width: 100%;
      padding: 0.95rem 1rem;
      border-radius: 14px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.08);
      color: rgba(245, 245, 245, 0.95);
      outline: none;
      transition: border 0.2s, box-shadow 0.2s, background 0.2s;
    }

    .field-input:focus {
      border-color: rgba(99, 179, 237, 0.9);
      box-shadow: 0 0 0 4px rgba(99, 179, 237, 0.22);
      background: rgba(255, 255, 255, 0.12);
    }

    .field-password {
      position: relative;
      display: flex;
      align-items: center;
    }

    .password-toggle {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.1rem;
      color: rgba(255, 255, 255, 0.55);
      cursor: pointer;
      transition: color 0.2s;
    }

    .password-toggle:hover {
      color: rgba(255, 255, 255, 0.85);
    }

    .actions {
      display: flex;
      gap: 0.9rem;
      flex-direction: column;
      margin-top: 0.5rem;
    }

    .login-link {
      text-align: center;
      color: rgba(229, 231, 235, 0.75);
      font-size: 0.9rem;
      margin: 0;
    }

    .login-link a {
      color: rgba(99, 179, 237, 0.95);
      text-decoration: none;
      font-weight: 700;
    }

    .login-link a:hover {
      text-decoration: underline;
    }

    @keyframes flyFromScreen {
      0% {
        opacity: 0;
        transform: translateZ(220px) rotateX(15deg);
      }
      60% {
        opacity: 1;
        transform: translateZ(-40px) rotateX(5deg);
      }
      100% {
        opacity: 1;
        transform: translateZ(0) rotateX(0);
      }
    }

    @media (max-width: 520px) {
      .register-card {
        width: 100%;
        padding: 1.6rem 1.4rem;
      }
    }
    `,
  ],
})
export class RegisterComponent {
  showPassword = false;
  showConfirm = false;
  form: FormGroup;

  constructor(private fb: FormBuilder, private msg: MessageService) {
    this.form = this.fb.group({
      usuario: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      fechaNacimiento: ['', [Validators.required, this.mayorDeEdad]],
      password: ['', [Validators.required, Validators.minLength(10), Validators.pattern(/^(?=.*[!@#$%^&*])/)]],
      confirmar: ['', Validators.required],
    }, { validators: this.passwordsIguales });
  }

  mayorDeEdad(control: AbstractControl): ValidationErrors | null {
    const fecha = new Date(control.value);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fecha.getFullYear();
    const cumplió = hoy >= new Date(fecha.setFullYear(fecha.getFullYear() + edad));
    return (cumplió ? edad : edad - 1) >= 18 ? null : { menorDeEdad: true };
  }

  passwordsIguales(group: AbstractControl): ValidationErrors | null {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmar')?.value;
    return pass === confirm ? null : { noCoinciden: true };
  }

  get f() { return this.form.controls; }

  registrar() {
    if (this.form.valid) {
      this.msg.add({ severity: 'success', summary: '¡Registro exitoso!', detail: 'Tu cuenta fue creada correctamente' });
    } else {
      this.form.markAllAsTouched();
      this.msg.add({ severity: 'error', summary: 'Error', detail: 'Revisa los campos del formulario' });
    }
  }
}