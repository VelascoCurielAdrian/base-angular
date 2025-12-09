# Variables CSS Centralizadas

## 📋 Resumen

Se han centralizado todos los colores y valores de diseño repetidos en variables CSS globales ubicadas en `/src/scss/variables.scss`. Esto permite:

- ✅ Mantener consistencia en toda la aplicación
- ✅ Cambiar colores de forma global fácilmente
- ✅ Evitar duplicación de código
- ✅ Facilitar el mantenimiento
- ✅ Mejorar la escalabilidad del proyecto

## 🎨 Variables Disponibles

### Colores Primarios
```css
--primary-color: #4467ab;          /* Azul principal */
--primary-dark: #1e293b;           /* Azul oscuro */
--primary-darker: #0f172a;         /* Azul muy oscuro */
--primary-light: #3b82f6;          /* Azul claro */
--primary-medium: #334155;         /* Azul medio */
--secondary-color: #284b8e;        /* Color secundario */
--accent-color: #0ea5e9;           /* Color de acento */
```

### Colores de Estado
```css
--error-color: #dc2626;            /* Color de error */
--error-bg: #fef2f2;               /* Fondo de error */
--error-border: #fecaca;           /* Borde de error */
--success-color: #16a34a;          /* Color de éxito */
```

### Colores de Texto
```css
--text-color: #2b3a57;             /* Texto principal */
--text-color-primary: #2b3a57;     /* Texto primario */
--text-color-secondary: #5b6b82;   /* Texto secundario */
--text-primary: #0f172a;           /* Texto principal (variante) */
--text-secondary: #64748b;         /* Texto secundario (variante) */
--text-muted: #94a3b8;             /* Texto atenuado */
```

### Colores de Borde
```css
--border-color: #e9eef3;           /* Borde principal */
--border-color-light: #e2e8f0;     /* Borde claro */
```

### Colores de Fondo
```css
--background: #f8fafc;             /* Fondo principal */
--background-color: #f5f7fa;       /* Fondo (variante) */
--white: #ffffff;                  /* Blanco */
```

### Sombras
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

### Colores con Opacidad
```css
--overlay-dark: rgba(0, 0, 0, 0.5);           /* Overlay oscuro */
--overlay-light: rgba(0, 0, 0, 0.05);         /* Overlay claro */
--white-transparent-10: rgba(255, 255, 255, 0.1);
--white-transparent-15: rgba(255, 255, 255, 0.15);
--white-transparent-20: rgba(255, 255, 255, 0.2);
--white-transparent-85: rgba(255, 255, 255, 0.85);
--white-transparent-98: rgba(255, 255, 255, 0.98);
--black-transparent-10: rgba(0, 0, 0, 0.1);
--black-transparent-20: rgba(0, 0, 0, 0.2);
--primary-transparent-10: rgba(59, 130, 246, 0.1);
--error-transparent-10: rgba(220, 38, 38, 0.1);
```

### Border Radius
```css
--radius-sm: 0.375rem;             /* 6px */
--radius-md: 0.5rem;               /* 8px */
--radius-lg: 0.75rem;              /* 12px */
--radius-xl: 1rem;                 /* 16px */
```

### Colores Slate (para degradados)
```css
--slate-300: #cbd5e1;
--slate-400: #94a3b8;
--slate-600: #64748b;
--slate-700: #334155;
--slate-800: #1e293b;
--slate-900: #0f172a;
```

## 📝 Uso

### En archivos SCSS/CSS
```scss
.mi-componente {
  color: var(--text-primary);
  background: var(--background);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}
```

### En templates HTML
```html
<div style="color: var(--text-primary)">Mi texto</div>
```

### En TypeScript (con Renderer2)
```typescript
this.renderer.setStyle(element, 'color', 'var(--text-primary)');
```

## 🔄 Archivos Actualizados

### 1. `/src/scss/variables.scss`
- ✅ Todas las variables CSS centralizadas
- ✅ Organizadas por categorías
- ✅ Comentarios descriptivos

### 2. `/src/scss/global.scss`
- ✅ Importa las variables
- ✅ Estilos globales aplicados

### 3. `/src/app/modules/auth/login.component.scss`
- ✅ Removidas todas las variables SASS locales
- ✅ Convertido a usar variables CSS globales
- ✅ Colores hardcoded reemplazados

### 4. `/src/app/containers/main-layout/main-layout.component.scss`
- ✅ Overlays actualizados con variables
- ✅ Scrollbar con variables CSS
- ✅ Colores hardcoded eliminados

## 🎯 Beneficios

1. **Consistencia**: Todos los componentes usan los mismos colores
2. **Mantenibilidad**: Un solo lugar para actualizar colores
3. **Tema dinámico**: Posibilidad de cambiar tema en tiempo de ejecución
4. **Performance**: CSS nativo, sin procesamiento adicional
5. **Escalabilidad**: Fácil agregar nuevos colores o variantes

## 🚀 Próximos Pasos (Recomendados)

1. **Modo Oscuro**: Crear un segundo set de variables para tema oscuro
2. **Temas Personalizados**: Permitir a los usuarios elegir temas
3. **Espaciado**: Centralizar también los valores de padding/margin
4. **Tipografía**: Variables para tamaños de fuente
5. **Transiciones**: Variables para duraciones y easing

## 💡 Ejemplo de Tema Oscuro (Futuro)

```css
[data-theme="dark"] {
  --primary-color: #6b8dd6;
  --background: #1a1a1a;
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  /* ... más variables ... */
}
```

## 📚 Referencias

- [MDN - CSS Custom Properties](https://developer.mozilla.org/es/docs/Web/CSS/--*)
- [CSS Variables Guide](https://www.w3schools.com/css/css3_variables.asp)
- [Using CSS Variables](https://css-tricks.com/a-complete-guide-to-custom-properties/)
