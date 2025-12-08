import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '@services/auth.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { ToastService } from '@services/toast.service';

import type { HttpError } from '@models/error.interface';

interface LoginFormValue {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _fb = inject(FormBuilder);
  private readonly _errorHandler = inject(ErrorHandlerService);
  private readonly _toast = inject(ToastService);

  public readonly username = computed(() => this._auth.account());

  public loginForm!: FormGroup;
  public showPassword = false;
  public errorMessage: string | null = null;

  constructor(private readonly _auth: AuthService) {
    // Redirigir al home si ya hay una sesión activa
    effect(() => {
      const username = this.username();
      if (username) {
        void this._router.navigate(['/']);
      }
    });
  }

  public ngOnInit(): void {
    // Inicializar formulario
    this.loginForm = this._fb.group({
      username: ['', [Validators.required.bind(Validators)]],
      password: ['', [Validators.required.bind(Validators)]],
    });
  }

  /**
   * Alterna la visibilidad de la contraseña
   */
  public togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Maneja el submit del formulario de login
   */
  public async onSubmit(): Promise<void> {
    const { username, password } = this.loginForm.value as LoginFormValue;

    try {
      this.errorMessage = null;
      await this._auth.loginWithCredentials(username, password);
      this._toast.success('¡Bienvenido de nuevo!');
      await this._router.navigate(['/']);
    } catch (error: unknown) {
      const httpError: HttpError = this._errorHandler.toHttpError(error);
      this.errorMessage = this._errorHandler.getUserMessage(httpError);
      this._toast.error(this.errorMessage);
    }
  }
}
