# ApiHttpClient - Cliente HTTP Centralizado

Cliente HTTP personalizado similar a Axios que proporciona una interfaz simplificada con configuración global, manejo de errores integrado y soporte para credenciales automáticas.

## Características

✅ **Configuración Global**: `withCredentials: true` por defecto  
✅ **Base URL Automática**: Usa `environment.api.baseUrl` automáticamente  
✅ **Manejo de Errores**: Integrado con `ErrorHandlerService`  
✅ **Métodos Simplificados**: GET, POST, PUT, PATCH, DELETE  
✅ **Soporte Async/Await**: Sin necesidad de `firstValueFrom`  
✅ **Soporte Observables**: Métodos con sufijo `$` para streams  
✅ **Type-Safe**: Totalmente tipado con TypeScript  

## Uso Básico

### Inyectar el Servicio

```typescript
import { inject, Injectable } from '@angular/core';
import { ApiHttpClient } from '@services/api-http-client.service';

@Injectable({ providedIn: 'root' })
export class MiServicio {
  private readonly _api = inject(ApiHttpClient);
}
```

### GET Request

```typescript
// Antes con HttpClient
const response = await firstValueFrom(
  this._http.get<Usuario[]>(`${baseUrl}/usuarios`, { withCredentials: true })
);

// Ahora con ApiHttpClient
const response = await this._api.get<Usuario[]>('/usuarios');
```

### POST Request

```typescript
// Antes con HttpClient
const response = await firstValueFrom(
  this._http.post<Usuario>(
    `${baseUrl}/usuarios`,
    { nombre, email },
    { withCredentials: true }
  )
);

// Ahora con ApiHttpClient
const response = await this._api.post<Usuario>('/usuarios', { nombre, email });
```

### PUT Request

```typescript
// Actualizar recurso completo
const usuario = await this._api.put<Usuario>(`/usuarios/${id}`, usuarioCompleto);
```

### PATCH Request

```typescript
// Actualización parcial
const usuario = await this._api.patch<Usuario>(`/usuarios/${id}`, { nombre: 'Nuevo' });
```

### DELETE Request

```typescript
await this._api.delete<void>(`/usuarios/${id}`);
```

## Opciones Avanzadas

### Query Parameters

```typescript
// Pasar parámetros de búsqueda
const usuarios = await this._api.get<Usuario[]>('/usuarios', {
  params: {
    page: 1,
    limit: 10,
    search: 'John',
    active: true
  }
});
// Resultado: /usuarios?page=1&limit=10&search=John&active=true
```

### Headers Personalizados

```typescript
const data = await this._api.get<Data>('/endpoint', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'X-Custom-Header': 'valor',
    'Accept-Language': 'es-ES'
  }
});
```

### Deshabilitar Base URL

Para llamar APIs externas sin usar `environment.api.baseUrl`:

```typescript
const data = await this._api.get<ExternalData>('https://api.externa.com/data', {
  useBaseUrl: false
});
```

### Deshabilitar Credenciales

Por defecto `withCredentials: true`. Para deshabilitarlo:

```typescript
const data = await this._api.get<Data>('/public-endpoint', {
  withCredentials: false
});
```

## Usando Observables

Todos los métodos tienen una versión con sufijo `$` que retorna Observables:

```typescript
// Para usar operadores RxJS
this._api.get$<Usuario[]>('/usuarios').pipe(
  map(usuarios => usuarios.filter(u => u.activo)),
  tap(usuarios => console.log('Usuarios activos:', usuarios.length))
).subscribe(usuarios => {
  this.usuarios = usuarios;
});

// Para cancelar peticiones
const subscription = this._api.get$<Data>('/data').subscribe(data => {
  console.log(data);
});

// Cancelar la petición
subscription.unsubscribe();
```

## Manejo de Errores

El cliente maneja errores automáticamente:

```typescript
async cargarUsuarios(): Promise<void> {
  try {
    // El error ya está procesado por ApiHttpClient
    this.usuarios = await this._api.get<Usuario[]>('/usuarios');
  } catch (error: unknown) {
    // Ya es un Error con mensaje legible
    console.error(error);
    
    // Opcionalmente, obtener más detalles
    const httpError = this._errorHandler.toHttpError(error);
    this.errorMessage = this._errorHandler.getUserMessage(httpError);
  }
}
```

## Ejemplos Completos

### Servicio CRUD

```typescript
@Injectable({ providedIn: 'root' })
export class ProductosService {
  private readonly _api = inject(ApiHttpClient);

  // Listar
  async obtenerProductos(): Promise<Producto[]> {
    return await this._api.get<Producto[]>('/productos');
  }

  // Obtener uno
  async obtenerProducto(id: number): Promise<Producto> {
    return await this._api.get<Producto>(`/productos/${id}`);
  }

  // Crear
  async crearProducto(producto: NuevoProducto): Promise<Producto> {
    return await this._api.post<Producto>('/productos', producto);
  }

  // Actualizar
  async actualizarProducto(id: number, producto: ActualizarProducto): Promise<Producto> {
    return await this._api.put<Producto>(`/productos/${id}`, producto);
  }

  // Eliminar
  async eliminarProducto(id: number): Promise<void> {
    await this._api.delete<void>(`/productos/${id}`);
  }
}
```

### Búsqueda con Filtros

```typescript
async buscarProductos(filtros: BusquedaFiltros): Promise<Producto[]> {
  return await this._api.get<Producto[]>('/productos/buscar', {
    params: {
      q: filtros.termino,
      categoria: filtros.categoria,
      precioMin: filtros.precioMin,
      precioMax: filtros.precioMax,
      disponible: filtros.disponible
    }
  });
}
```

### Upload de Archivos

```typescript
async subirArchivo(archivo: File): Promise<Respuesta> {
  const formData = new FormData();
  formData.append('file', archivo);

  return await this._api.post<Respuesta>('/upload', formData, {
    headers: {
      // No establecer Content-Type para FormData
      // El navegador lo hace automáticamente con boundary
    }
  });
}
```

### Download de Archivos

```typescript
async descargarArchivo(id: number): Promise<Blob> {
  return await this._api.get<Blob>(`/archivos/${id}/download`, {
    responseType: 'blob'
  });
}
```

## Comparación: Antes vs Ahora

### Antes (HttpClient)

```typescript
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';

async obtenerDatos(): Promise<Data> {
  try {
    const baseUrl = environment.api.baseUrl;
    const response = await firstValueFrom(
      this._http.get<Data>(`${baseUrl}/datos`, { 
        withCredentials: true,
        params: { id: '123' }
      })
    );
    return response;
  } catch (error: unknown) {
    // Manejo manual de errores
    if (error instanceof HttpErrorResponse) {
      console.error('Error HTTP:', error.status);
    }
    throw error;
  }
}
```

### Ahora (ApiHttpClient)

```typescript
import { ApiHttpClient } from '@services/api-http-client.service';

async obtenerDatos(): Promise<Data> {
  try {
    return await this._api.get<Data>('/datos', {
      params: { id: '123' }
    });
  } catch (error: unknown) {
    // Error ya procesado
    console.error(error);
    throw error;
  }
}
```

## Ventajas

1. **Menos Código**: Reduce boilerplate significativamente
2. **Más Legible**: Código más limpio y fácil de entender
3. **Type-Safe**: Todos los métodos están totalmente tipados
4. **Configuración Global**: No repetir `withCredentials` y `baseUrl`
5. **Manejo de Errores**: Errores procesados automáticamente
6. **Consistente**: Mismo patrón en toda la aplicación
7. **Flexible**: Soporta configuraciones personalizadas cuando sea necesario

## Configuración

El cliente usa `environment.api.baseUrl` por defecto. Asegúrate de tenerlo configurado:

```typescript
// environments/environment.ts
export const environment = {
  api: {
    baseUrl: 'http://localhost:3000/api',
    endpoints: {
      login: '/auth/login',
      logout: '/auth/logout',
      verify: '/auth/verify'
    }
  }
};
```

## Interceptores

El `authInterceptor` sigue funcionando y agrega automáticamente credenciales a todas las peticiones:

```typescript
// interceptors/auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const clonedRequest = req.clone({
    withCredentials: true,
  });
  return next(clonedRequest);
};
```

## Testing

El servicio es fácil de testear con mocks:

```typescript
const mockApiClient = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
};

TestBed.configureTestingModule({
  providers: [
    MiServicio,
    { provide: ApiHttpClient, useValue: mockApiClient }
  ]
});
```
