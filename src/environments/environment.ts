import { Environment } from './environment.interface';

export const environment: Environment = {
  appId: '0a78511d-7609-43f0-ae41-e9508c8f50e6',
  production: true,
  envName: 'PRODUCTION',
  appConfig: '/api/settings.json',
  authIdp: {
    msId: {
      tenantId: '76d81621-b9a9-4786-bb8f-a2efa839eee2',
      clientId: '11a7a763-48d7-4e32-819e-55fd5b7be8c1',
      authorityUrl: 'https://login.microsoftonline.com',
      redirectUri: 'http://localhost:4200',
      postLogoutRedirectUri: 'http://localhost:4200',
      graphUrl: 'https://graph.microsoft.com',
      scopes: ['User.Read'],
      graphParams:
        'displayName,givenName,surname,employeeId,mail,jobTitle,department,companyName,businessPhones,mobilePhone,officeLocation,preferredLanguage,userPrincipalName,id',
      profileCacheTTL: 300000, // 5 minutos
      cacheLocation: 'sessionStorage',
      logLevel: 'Error',
      enableCSP: true,
      allowedDomains: ['coppel.com', 'microsoftonline.com', 'graph.microsoft.com'],
      tokenRefreshBuffer: 300000, // 5 minutos
      maxTokenAge: 3600000, // 1 hora
    },
  },
  security: {
    crypto: {
      saltText: 'secure-storage-salt-prod',
      iterations: 100000,
      ivLength: 12,
      keyPrefix: 'secure__',
      keyUsages: {
        import: ['deriveKey'],
        derive: ['encrypt', 'decrypt'],
      },
    },
  },
};
