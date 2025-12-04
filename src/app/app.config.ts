import {
  provideHttpClient,
  withInterceptorsFromDi,
  withFetch,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideAppInitializer, inject } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import {
  MsalBroadcastService,
  MsalGuard,
  MsalGuardConfiguration,
  MsalInterceptor,
  MsalInterceptorConfiguration,
  MsalService,
  MSAL_GUARD_CONFIG,
  MSAL_INTERCEPTOR_CONFIG,
  MSAL_INSTANCE,
} from '@azure/msal-angular';
import {
  InteractionType,
  LogLevel,
  PublicClientApplication,
} from '@azure/msal-browser';
import { environment } from '@environments/environment';

import { routes } from './app.routes';

import type { MsalConfig } from '@environments/environment.interface';

function createMsalInstance(): PublicClientApplication {
  const cfg: MsalConfig = environment.authIdp.msId;
  return new PublicClientApplication({
    auth: {
      clientId: cfg.clientId,
      authority: `${cfg.authorityUrl}/${cfg.tenantId}`,
      redirectUri: cfg.redirectUri,
      postLogoutRedirectUri: cfg.postLogoutRedirectUri,
    },
    cache: {
      cacheLocation: cfg.cacheLocation,
      storeAuthStateInCookie: false,
    },
    system: {
      loggerOptions: {
        logLevel:
          cfg.logLevel === 'Verbose'
            ? LogLevel.Verbose
            : cfg.logLevel === 'Info'
            ? LogLevel.Info
            : cfg.logLevel === 'Warning'
            ? LogLevel.Warning
            : LogLevel.Error,
        loggerCallback: (_level, _message, _containsPii) => {
          // Logger callback implementation
        },
      },
    },
  });
}

function initializeMsal(msalInstance: PublicClientApplication): () => Promise<void> {
  return () => msalInstance.initialize();
}

function guardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
  };
}

function interceptorConfigFactory(): MsalInterceptorConfiguration {
  const cfg = environment.authIdp.msId;
  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap: new Map<string, string[]>([
      [cfg.graphUrl, cfg.scopes],
    ]),
  };
}

// Providers de configuración de la aplicación e inyección de dependencias
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    { provide: MSAL_INSTANCE, useFactory: createMsalInstance },
    provideAppInitializer(() => {
      // Inicializar MSAL al arrancar la aplicación
      const msalInstance = inject<PublicClientApplication>(MSAL_INSTANCE);
      return initializeMsal(msalInstance)();
    }),
    { provide: MSAL_GUARD_CONFIG, useFactory: guardConfigFactory },
    { provide: MSAL_INTERCEPTOR_CONFIG, useFactory: interceptorConfigFactory },
    { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
  ],
};
