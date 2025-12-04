import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';

import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _msalService = inject(MsalService);
  private readonly _msalBroadcast = inject(MsalBroadcastService);

  public readonly username = computed(() => this._auth.account());
  public readonly profile = computed(() => this._auth.profile());

  public user = '';
  public pass = '';

  constructor(private readonly _auth: AuthService) {
    // Redirigir al home si ya hay una sesión activa
    effect(() => {
      const username = this.username();
      if (username) {
        void this._router.navigate(['/home']);
      }
    });
  }

  public ngOnInit(): void {
    // Manejar la respuesta de redirección de MSAL
    this._msalBroadcast.inProgress$
      .pipe(filter((status) => status === InteractionStatus.None))
      .subscribe(() => {
        const account = this._msalService.instance.getActiveAccount();
        if (account) {
          void this._router.navigate(['/home']);
        }
      });
  }

  /**
   * Inicia sesión mediante IDC (MSAL)
   */
  public login(): void {
    this._auth.login();
  }

  public logout(): void {
    this._auth.logout();
  }

  public loadProfile(): void {
    void this._auth.loadProfile();
  }

  /**
   * Maneja el submit del formulario para login tradicional
   * Por ahora redirige al login de IDC, pero puede implementarse autenticación local
   */
  public onSubmit(event: Event): void {
    event.preventDefault();
    // TODO: Implementar autenticación con usuario y contraseña
    // Por ahora usamos el mismo flujo de IDC
    this.login();
  }
}
