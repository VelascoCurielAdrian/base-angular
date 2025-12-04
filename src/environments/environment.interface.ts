/**
 * Interfaces para configuración de environments
 */

export interface MsalConfig {
  tenantId: string;
  clientId: string;
  authorityUrl: string;
  redirectUri: string;
  postLogoutRedirectUri: string;
  graphUrl: string;
  scopes: string[];
  graphParams: string;
  profileCacheTTL: number;
  cacheLocation: 'sessionStorage' | 'localStorage';
  logLevel: 'Error' | 'Warning' | 'Info' | 'Verbose';
  enableCSP: boolean;
  allowedDomains: string[];
  tokenRefreshBuffer: number;
  maxTokenAge: number;
}

export interface Environment {
  appId: string;
  production: boolean;
  envName: 'PRODUCTION' | 'DEVELOPMENT' | 'LOCAL' | 'STAGING';
  appConfig: string;
  authIdp: {
    msId: MsalConfig;
  };
  security: SecurityConfig;
}

export interface CryptoConfig {
  saltText: string;
  iterations: number;
  ivLength: number;
  keyPrefix: string;
  keyUsages: {
    import: KeyUsage[];
    derive: KeyUsage[];
  };
}

export interface SecurityConfig {
  crypto: CryptoConfig;
}
