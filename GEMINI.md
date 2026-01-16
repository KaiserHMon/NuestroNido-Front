# Información del Proyecto - Nuestro Nido (Front)

Este documento contiene un resumen técnico de la estructura, herramientas y configuración del proyecto.

## 1. Inventario (Directorios Clave)

- **.next/**: Archivos generados por Next.js (build, cache, etc.).
- **app/**: Directorio principal de la aplicación (Next.js App Router).
  - **dashboard/**: Módulos del panel de control.
  - **home/**: Página de inicio.
  - **login/**, **register/**, **recover-password/**: Módulos de autenticación.
- **components/**: Componentes de React reutilizables.
  - **auth/**: Componentes específicos de autenticación.
  - **dashboard/**: Lógica y componentes de las secciones del dashboard.
  - **dialogs/**: Modales y diálogos de la aplicación.
  - **familia/**: Componentes relacionados con la gestión de familia.
  - **ui/**: Biblioteca de componentes UI base (Shadcn/UI o similar).
- **config/**: Archivos de configuración de la aplicación.
- **hooks/**: Custom Hooks de React (`use-auth`, `use-familia`, etc.).
- **lib/**: Utilidades, tipos y validaciones (`utils.ts`, `types.ts`, `validation.ts`).
- **services/**: Servicios para comunicación con API (`auth-service.ts`).
- **styles/**: Estilos globales (`globals.css`).
- **tests/**: Tests unitarios y de integración.

## 2. Dependencias (`package.json`)

### Dependencias Principales

- **Framework:** `next` (^16.1.1), `react` (^19.2.3), `react-dom` (^19.2.3).
- **UI/Estilos:** `tailwindcss` (^4.1.9), `lucide-react` (iconos), `class-variance-authority`, `clsx`, `tailwind-merge`.
- **Componentes UI:** `@radix-ui/*` (primitivos accesibles), `sonner` (toasts), `cmdk` (comandos), `embla-carousel-react`, `input-otp`, `vaul`.
- **Gestión de Estado/Formularios:** `react-hook-form` (^7.60.0), `@hookform/resolvers`, `zod` (validación schema).
- **Utilidades:** `date-fns` (fechas), `recharts` (gráficos).

### Dependencias de Desarrollo

- **Lenguaje:** `typescript` (^5).
- **Linting/Formato:** `eslint` (^9.39.2), `prettier` (^3.7.4), `eslint-config-next`, `eslint-plugin-react`, etc.
- **Testing:** `vitest` (^4.0.16), `@testing-library/react`, `@testing-library/user-event`, `jsdom`.

## 3. Configuración

### ESLint (`.eslintrc.json`)

Extiende de:

- `next/core-web-vitals`
- `plugin:@typescript-eslint/recommended`
- `plugin:react/recommended`
- `plugin:jsx-a11y/recommended`
  Reglas destacadas:
- `@typescript-eslint/no-explicit-any`: warning.
- `@typescript-eslint/no-unused-vars`: warning (ignora patrones `^_`).

### Prettier (`.prettierrc`)

- Sin punto y coma: `false` (usa punto y coma).
- Comillas simples: `true`.
- Ancho de impresión: `100`.
- Tabulación: `2` espacios.
- Trailing comma: `es5`.

### Vitest (`vitest.config.ts`)

- Entorno: `jsdom`.
- Alias: `@` apunta a `./`.
- Cobertura: `v8`, reportes en text, json, html.
- Plugins: `@vitejs/plugin-react`.

## 4. Scripts (`npm` / `pnpm`)

- `dev`: Inicia el servidor de desarrollo (`next dev`).
- `build`: Construye la aplicación para producción (`next build`).
- `start`: Inicia el servidor de producción (`next start`).
- `lint`: Ejecuta el linter (`eslint`).
- `lint:fix`: Ejecuta el linter y corrige errores automáticamente.
- `format`: Formatea el código con Prettier.
- `format:check`: Verifica el formato sin modificar archivos.
- `test`: Ejecuta los tests con Vitest.
- `test:ui`: Abre la interfaz gráfica de Vitest.
- `test:coverage`: Ejecuta tests con reporte de cobertura.

## 5. Tests

La suite de tests utiliza **Vitest**.

- Configuración: `vitest.config.ts`.
- Setup global: `vitest.setup.ts`.
- Ubicación de tests: Carpeta `tests/` y archivos `*.test.ts` o `*.test.tsx`.

## 6. MCPS (Módulos y Componentes Principales)

### Módulos (app/)

- **Dashboard:** `app/dashboard` (incluye sub-rutas para calendario, listas, miembros, notas).
- **Auth:** `app/login`, `app/register`, `app/recover-password`.
- **Home:** `app/home`.

### Componentes Clave (components/)

- **Secciones Dashboard:**
  - `calendario-section.tsx`: Lógica del calendario.
  - `lista-section.tsx`: Listas de tareas/elementos.
  - `miembros-section.tsx`: Gestión de miembros de la familia.
  - `notas-section.tsx`: Gestión de notas.
- **Elementos UI Reutilizables:**
  - `nota-card.tsx`, `nota-filter.tsx`.
  - `tareas-tab.tsx`: Pestaña de tareas.
  - `landing-header.tsx`.
- **Diálogos:**
  - `crear-tarea-dialog.tsx`: Creación de tareas.
  - `crear-nota-dialog.tsx`: Creación de notas.
  - `fecha-expandida-modal.tsx`: Detalle de fecha en calendario.
- **Hooks:**
  - `use-auth.ts`: Manejo de sesión.
  - `use-familia.ts`: Contexto de familia.

Este archivo sirve como referencia rápida para el contexto del proyecto.
