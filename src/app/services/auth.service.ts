import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, type WritableSignal } from '@angular/core';
import { Router } from '@angular/router';

import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { InteractionStatus, type AccountInfo } from '@azure/msal-browser';
import { environment } from '@environments/environment';
import { type MsalConfig } from '@environments/environment.interface';
import { filter, firstValueFrom } from 'rxjs';

import type { UserProfile } from '@models/index';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public readonly account: WritableSignal<string | null> = signal<string | null>(null);
  public readonly profile: WritableSignal<UserProfile | null> = signal<UserProfile | null>(null);
  public readonly isInitialized: WritableSignal<boolean> = signal<boolean>(false);
  public readonly initializationPromise: Promise<void>;

  public get currentAccount(): string | null {
    return this.account();
  }

  private readonly _graphUrl: string;
  private readonly _scopes: string[];
  private readonly _graphParams: string;

  constructor(
    private readonly _msal: MsalService,
    private readonly _http: HttpClient,
    private readonly _msalBroadcast: MsalBroadcastService,
    private readonly _router: Router = inject(Router),
  ) {
    const msalConfig: MsalConfig = environment.authIdp.msId;
    this._graphUrl = msalConfig.graphUrl;
    this._scopes = msalConfig.scopes;
    this._graphParams = msalConfig.graphParams;

    this.initializationPromise = this._initialize();
    this._handleRedirectResponse();
  }

  private async _initialize(): Promise<void> {
    return new Promise<void>((resolve) => {
      // Intentar obtener la cuenta inmediatamente
      const activeAccount = this._getActiveAccount();

      if (activeAccount) {
        this._msal.instance.setActiveAccount(activeAccount);
        this.account.set(activeAccount.username);
        this.isInitialized.set(true);
        resolve();
        return;
      }

      // Si no hay cuenta, esperar a que MSAL termine sus operaciones
      const subscription = this._msalBroadcast.inProgress$
        .pipe(filter((status) => status === InteractionStatus.None))
        .subscribe(() => {
          const account = this._getActiveAccount();

          if (account) {
            this._msal.instance.setActiveAccount(account);
            this.account.set(account.username);
          }

          this.isInitialized.set(true);
          subscription.unsubscribe();
          resolve();
        });

      // Timeout de seguridad: si después de 5 segundos no se resuelve, continuar
      setTimeout(() => {
        if (!this.isInitialized()) {
          this.isInitialized.set(true);
          subscription.unsubscribe();
          resolve();
        }
      }, 5000);
    });
  }

  private _handleRedirectResponse(): void {
    this._msal.instance.handleRedirectPromise().then((response) => {
      if (response?.account) {
        this._msal.instance.setActiveAccount(response.account);
        this.account.set(response.account.username);
        void this.loadProfile();
      }
    }).catch((error: unknown) => {
      console.error('Error handling redirect:', error instanceof Error ? error.message : String(error));
    });
  }

  public login(): void {
    void this._msal.loginRedirect({ scopes: this._scopes });
  }

  public logout(): void {
    // Limpiar los datos de sesión sin destruir la instancia de MSAL
    this.account.set(null);
    this.profile.set(null);

    // Limpiar sessionStorage (donde MSAL almacena los tokens según la configuración)
    sessionStorage.clear();

    // Opcional: También limpiar localStorage si es necesario
    // localStorage.clear();

    // Remover la cuenta activa de MSAL sin hacer logout completo
    this._msal.instance.setActiveAccount(null);

    // Redirigir al login
    void this._router.navigate(['/login']);
  }

  public async loadProfile(): Promise<void> {
    try {
      const token = await this._acquireToken();
      const url = `${this._graphUrl}/v1.0/me?$select=${this._graphParams}`;

      const profile = await firstValueFrom(
        this._http.get<UserProfile>(url, {
          headers: { authorization: `Bearer ${token}` },
        }),
      );

      this.profile.set(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
      throw error;
    }
  }

  private _getActiveAccount(): AccountInfo | null {
    const currentAccount = this._msal.instance.getActiveAccount();

    if (currentAccount) {
      return currentAccount;
    }

    const accounts = this._msal.instance.getAllAccounts();
    return accounts.length > 0 ? accounts[0] : null;
  }

  private async _acquireToken(): Promise<string> {
    const result = await firstValueFrom(
      this._msal.acquireTokenSilent({ scopes: this._scopes }),
    );

    return result.accessToken;
  }
}
