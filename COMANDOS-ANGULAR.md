# 📖 Guía de Comandos Angular y Creación de Módulos

## 🚀 Comandos Básicos de Angular CLI

### Iniciar el servidor de desarrollo
```bash
npm start
# o
ng serve
```
Abre el navegador en `http://localhost:4200/`

### Compilar el proyecto
```bash
npm run build          # Build de producción
ng build              # Build de producción
ng build --watch      # Build con watch mode
```

### Ejecutar pruebas
```bash
npm test              # Ejecutar pruebas unitarias
ng test              # Ejecutar pruebas con Vitest
```

### Linting y formato
```bash
npm run lint          # Ejecutar ESLint
npm run lint:fix      # Corregir errores de ESLint automáticamente
npm run format        # Formatear código con Prettier
npm run format:check  # Verificar formato sin modificar
```

---

## 📦 Crear un Nuevo Módulo (Componente Standalone)

Este proyecto usa **Standalone Components**, por lo que no necesitas crear módulos NgModule tradicionales.

### 1. Crear un nuevo módulo de características

```bash
# Estructura recomendada: src/app/modules/[nombre-modulo]
ng generate component modules/[nombre-modulo] --standalone --skip-tests
```

**Ejemplo:** Crear módulo de usuarios
```bash
ng generate component modules/usuarios --standalone --skip-tests
```

Esto creará:
```
src/app/modules/usuarios/
├── usuarios.component.ts
├── usuarios.component.html
├── usuarios.component.scss
└── usuarios.component.spec.ts (si no usas --skip-tests)
```

### 2. Estructura recomendada para un módulo completo

Si necesitas crear un módulo con múltiples componentes:

```bash
# Crear el componente principal
ng g c modules/usuarios --standalone --skip-tests

# Crear sub-componentes (opcional)
ng g c modules/usuarios/lista-usuarios --standalone --skip-tests
ng g c modules/usuarios/detalle-usuario --standalone --skip-tests
ng g c modules/usuarios/form-usuario --standalone --skip-tests
```

### 3. Crear la ruta del módulo

Edita el archivo `src/app/routes/private.routes.ts` o `public.routes.ts`:

```typescript
import { Routes } from '@angular/router';

export const privateRoutes: Routes = [
  {
    path: 'usuarios',
    loadComponent: () => 
      import('../modules/usuarios/usuarios.component').then(m => m.UsuariosComponent),
    data: { title: 'Usuarios' }
  },
  // ... otras rutas
];
```

### 4. Agregar al menú de navegación

Edita `src/app/config/navigation/navigation.constants.ts`:

```typescript
import { Users } from 'lucide-angular'; // Importar icono

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'usuarios',
    label: 'Usuarios',
    icon: Users,
    route: '/usuarios'
  },
  // ... otros items
];
```

---

## 🎨 Crear Componentes en Otras Carpetas

### Componente compartido (shared)
```bash
ng g c shared/mi-componente --standalone --skip-tests
```

### Directiva personalizada
```bash
ng g directive directives/mi-directiva --standalone --skip-tests
```

### Pipe personalizado
```bash
ng g pipe pipes/mi-pipe --standalone --skip-tests
```

### Servicio
```bash
ng g service services/mi-servicio --skip-tests
```

### Guard
```bash
ng g guard guards/mi-guard --skip-tests
```

### Interface/Model
```bash
ng g interface models/mi-modelo
```

---

## 📋 Ejemplo Completo: Crear Módulo de Reportes

### Paso 1: Crear el componente
```bash
ng g c modules/reportes --standalone --skip-tests
```

### Paso 2: Crear sub-componentes si es necesario
```bash
ng g c modules/reportes/tabla-reportes --standalone --skip-tests
ng g c modules/reportes/filtros-reportes --standalone --skip-tests
```

### Paso 3: Crear el servicio
```bash
ng g service services/reportes --skip-tests
```

### Paso 4: Crear interfaces
```bash
ng g interface models/reporte
```

### Paso 5: Agregar la ruta en `private.routes.ts`
```typescript
{
  path: 'reportes',
  loadComponent: () => 
    import('../modules/reportes/reportes.component').then(m => m.ReportesComponent),
  data: { title: 'Reportes' }
}
```

### Paso 6: Agregar al menú de navegación en `navigation.constants.ts`
```typescript
import { FileText } from 'lucide-angular';

{
  id: 'reportes',
  label: 'Reportes',
  icon: FileText,
  route: '/reportes'
}
```

---

## 🏗️ Estructura de un Componente Standalone

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mi-componente',
  standalone: true,
  imports: [CommonModule, RouterLink], // Importar módulos necesarios
  templateUrl: './mi-componente.component.html',
  styleUrls: ['./mi-componente.component.scss']
})
export class MiComponenteComponent {
  // Tu código aquí
}
```

---

## 🔥 Comandos Útiles Adicionales

### Ver ayuda de generadores
```bash
ng generate --help
```

### Listar todos los schematics disponibles
```bash
ng generate --help
```

### Generar con opciones específicas
```bash
# Componente sin archivo de estilos
ng g c modules/mi-componente --standalone --skip-tests --inline-style

# Componente sin archivo HTML
ng g c modules/mi-componente --standalone --skip-tests --inline-template

# Servicio con providedIn: 'root'
ng g service services/mi-servicio --skip-tests
```

---

## 📁 Estructura Recomendada de Carpetas

```
src/app/
├── containers/          # Layouts principales
│   └── main-layout/
├── modules/            # ✅ Módulos de características
│   ├── auth/
│   ├── home/
│   ├── usuarios/      # ← Nuevo módulo
│   └── reportes/      # ← Nuevo módulo
├── shared/            # Componentes compartidos
│   ├── appbar/
│   ├── sidebar/
│   └── mi-nuevo-componente/
├── services/          # ✅ Servicios
│   ├── auth.service.ts
│   └── mi-servicio.ts
├── models/           # ✅ Interfaces y tipos
│   ├── user.interface.ts
│   └── mi-modelo.interface.ts
├── guards/           # Guards de autenticación
├── directives/       # Directivas personalizadas
├── pipes/           # Pipes personalizados
└── routes/          # Configuración de rutas
    ├── private.routes.ts
    └── public.routes.ts
```

---

## 🎯 Mejores Prácticas

1. **Usa Standalone Components** (ya configurado en este proyecto)
2. **Lazy Loading**: Usa `loadComponent` para cargar módulos bajo demanda
3. **Nomenclatura**: Usa kebab-case para nombres de archivos (`mi-componente.component.ts`)
4. **Organización**: Agrupa componentes relacionados en la misma carpeta
5. **Servicios**: Crea servicios reutilizables en `services/`
6. **Interfaces**: Define tipos en `models/` para mejor tipado
7. **Skip Tests**: Usa `--skip-tests` si no escribirás pruebas inmediatamente
8. **Iconos**: Usa Lucide Angular para iconos consistentes

---

## 🔍 Recursos Adicionales

- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [Angular Style Guide](https://angular.dev/style-guide)
- [Standalone Components](https://angular.dev/guide/components/importing)
- [Lucide Icons](https://lucide.dev/)

---

## 💡 Tips

- Usa `ng g` como atajo de `ng generate`
- Usa `--dry-run` para previsualizar cambios sin crearlos
- Usa `--help` en cualquier comando para ver opciones disponibles
- Los componentes standalone no necesitan ser declarados en módulos

```bash
# Ejemplo: Previsualizar la creación sin hacer cambios
ng g c modules/nuevo-modulo --standalone --dry-run
```
