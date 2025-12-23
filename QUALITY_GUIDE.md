# 🔧 Guía de Testing, Linting y Calidad del Código

Este documento describe cómo usar las herramientas de calidad de código configuradas en el proyecto.

## 📋 Scripts Disponibles

### ESLint - Análisis de Código

Detecta errores de linting y problemas de código.

```bash
# Ejecutar análisis de linting
npm run lint

# Auto-arreglar problemas que se pueden corregir automáticamente
npm run lint:fix
```

**Estado actual:** 59 problemas (14 errores, 45 warnings)

- Los errores requieren corrección manual (setState en effects, accesibilidad, etc.)
- Las advertencias son mejoras que se pueden ignorar por ahora

### Prettier - Formato de Código

Formatea automáticamente el código según estándares definidos.

```bash
# Formatear todos los archivos
npm run format

# Verificar qué archivos necesitan formateado (sin aplicar cambios)
npm run format:check
```

### Vitest - Testing Framework

Ejecuta tests unitarios e integración para validar la lógica.

```bash
# Ejecutar todos los tests una sola vez
npm test
# o
npx vitest run

# Ejecutar tests en modo observación (se ejecutan al cambiar archivos)
npx vitest

# Ejecutar tests con UI interactivo
npm run test:ui
npx vitest --ui

# Generar reporte de cobertura de tests
npm run test:coverage
```

**Estado actual:** ✅ 5 tests pasando

- Tests básicos del hook `useAuth`
- Estructura lista para agregar más tests
- Cobertura inicial: 0% (apenas comenzando)

## 🏗️ Configuraciones

### ESLint (`eslint.config.js`)

- ✅ React 19 configurado
- ✅ TypeScript strict mode
- ✅ Accesibilidad (jsx-a11y) habilitada
- ✅ Hooks rules (react-hooks) activadas
- ✅ Globals del navegador definidos (localStorage, fetch, etc.)

### Prettier (`.prettierrc`)

- Print width: 100 caracteres
- Tabs: 2 espacios
- Comillas simples
- Trailing commas: ES5
- Line ending: LF

### Vitest (`vitest.config.ts` + `vitest.setup.ts`)

- ✅ jsdom environment para testing de React
- ✅ Mocks de Next.js (navigation, router)
- ✅ ResizeObserver mock
- ✅ @testing-library/jest-dom

## 🎯 Problemas Críticos Identificados

### 1. **setState en useEffect** (6 errores)

Ejemplos:

- [app/dashboard/page.tsx](app/dashboard/page.tsx#L38)
- [app/home/page.tsx](app/home/page.tsx#L26)
- [components/calendario-section.tsx](components/calendario-section.tsx#L39)
- [components/lista-section.tsx](components/lista-section.tsx#L51)
- [components/miembros-section.tsx](components/miembros-section.tsx#L29)
- [components/notas-section.tsx](components/notas-section.tsx#L23)

**Solución recomendada:** Usar `useCallback` o `useLayoutEffect` con condiciones para evitar renders cascadas.

### 2. **Accesibilidad** (8 errores)

- autoFocus en formularios (desactívalo para mejor a11y)
- Labels desasociados de inputs
- Elementos no interactivos con listeners (use buttons)
- Anclas sin contenido accesible

**Archivos afectados:**

- [components/dialogs/editar-familia-dialog.tsx](components/dialogs/editar-familia-dialog.tsx#L106)
- [components/dialogs/eliminar-familia-dialog.tsx](components/dialogs/eliminar-familia-dialog.tsx#L132)
- [components/auth/login-form.tsx](components/auth/login-form.tsx#L109)
- [components/nota-filter.tsx](components/nota-filter.tsx#L34)
- [components/ui/pagination.tsx](components/ui/pagination.tsx#L40)
- [components/ui/input-group.tsx](components/ui/input-group.tsx#L63)

### 3. **Función Impura en Render** (1 error)

- [components/ui/sidebar.tsx](components/ui/sidebar.tsx#L587): `Math.random()` en useMemo

**Solución:** Generar el valor aleatorio una sola vez en un estado/ref.

### 4. **Variables No Utilizadas** (45 warnings)

Imports y variables no utilizadas en múltiples archivos. ESLint ya las marca para fácil limpieza.

## 📊 Métricas Iniciales

| Métrica                | Valor               |
| ---------------------- | ------------------- |
| **Total de problemas** | 59 (originales: 67) |
| **Errores**            | 14 (originales: 21) |
| **Warnings**           | 45                  |
| **Tests pasando**      | 5/5 ✅              |
| **Cobertura de tests** | 0% (en desarrollo)  |

## 🚀 Próximos Pasos Recomendados

1. **Corregir StatesetState en Effects** → Prioridad ALTA
   - Usar React Query o Zustand para state management
   - O usar useCallback con deps array correcto

2. **Mejorar Accesibilidad** → Prioridad ALTA
   - Remover autoFocus
   - Asociar labels con inputs (htmlFor)
   - Cambiar divs interactivos a buttons

3. **Aumentar Cobertura de Tests** → Prioridad MEDIA
   - Agregar tests para hooks personalizados
   - Tests de servicios (auth-service, token-service)
   - Tests de componentes críticos

4. **Refactorizar Código Duplicado** → Prioridad MEDIA
   - Extraer componente base para formularios
   - Crear wrapper genérico para diálogos
   - Reutilizar lógica en secciones

## 📝 Notas

- **ESLint** se ejecuta **manualmente** con `npm run lint`
- **Prettier** se ejecuta **manualmente** con `npm run format`
- No hay pre-commit hooks automáticos (según solicitud)
- Los tests se pueden ejecutar en modo observación con `npx vitest`
- Hay una UI interactiva para tests: `npm run test:ui`

## 🔗 Referencias Útiles

- [ESLint Docs](https://eslint.org/docs/)
- [Prettier Docs](https://prettier.io/docs/)
- [Vitest Docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Accesibilidad Web (A11y)](https://www.a11y-project.com/)
