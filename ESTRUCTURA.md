# Estructura del proyecto Front Menu CIA

## Estructura de carpetas

```
src/
├── app/
│   ├── containers/          # Layouts principales de la aplicación
│   ├── directives/          # Directivas personalizadas
│   ├── guards/              # Guards de autenticación y permisos
│   │   └── auth.guard.ts
│   ├── helpers/             # Interceptors, resolvers, helpers
│   ├── models/              # Interfaces y tipos TypeScript
│   ├── modules/             # Módulos de características
│   │   └── auth/            # Módulo de autenticación
│   │       └── login.component.ts
│   ├── pipes/               # Pipes personalizados
│   ├── services/            # Servicios de la aplicación
│   │   └── auth.service.ts
│   ├── shared/              # Componentes compartidos
│   └── state/               # Gestión de estado
├── assets/
│   ├── img/                 # Imágenes
│   └── settings/            # Archivos de configuración
├── scss/                    # Estilos globales SCSS
│   ├── variables.scss
│   └── global.scss
└── environments/            # Configuraciones de entorno
```

## Características implementadas

✅ Estructura de carpetas organizada según mejores prácticas de Angular
✅ Componente de login funcional en `modules/auth`
✅ Servicio de autenticación movido a `services/`
✅ Guard de autenticación en `guards/`
✅ Template limpio en `app.html` con solo `<router-outlet />`
✅ Rutas actualizadas para usar el nuevo componente de login
✅ Carpetas de assets organizadas (img, settings)
✅ Estructura SCSS preparada para estilos globales

## Próximos pasos

- Agregar más módulos de funcionalidades en `modules/`
- Crear componentes compartidos en `shared/`
- Definir interfaces en `models/`
- Agregar interceptors en `helpers/`
- Implementar directivas personalizadas en `directives/`
- Configurar gestión de estado en `state/`
