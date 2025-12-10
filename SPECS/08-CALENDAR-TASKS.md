# SPEC-08: Calendario con Tareas y Pestaña Mis Tareas

## Objetivos

1. **Pestaña "Mis Tareas"**: Listar tareas del usuario actual con filtros por período
2. **Ajustar tamaño calendario**: Más compacto con mejor distribución visual
3. **Indicadores de tareas**: Puntos de color alineados a la izquierda, número de día centrado arriba
4. **Expansión de fecha**: Clickear una fecha expande el calendario para mostrar tareas de ese día
5. **Visualización de miembros**: Mostrar qué miembro tiene qué tarea en cada fecha

## Requisitos Funcionales

### RF-01: Pestaña "Mis Tareas"

- **Ubicación**: Dentro de CalendarioSection, junto a la vista de calendario (tabs o toggle)
- **Contenido**: Lista de tareas del usuario actual
- **Filtros disponibles**:
  - Día: Solo tareas de hoy
  - Semana: Tareas de los próximos 7 días (incluyendo hoy)
  - Mes: Tareas del mes actual
- **Orden**: Cronológico ascendente (próximas primero)
- **Campos por tarea**: 
  - Fecha y hora
  - Nombre/descripción de tarea
  - Color del miembro (dot visual)
  - Estado (completa/pendiente) - visual con opacidad
- **Contador**: Cantidad de tareas pendientes/completadas
- **Responsive**: Stack en móvil, 2 columnas en desktop si aplica

### RF-02: Ajustar Tamaño Calendario

- **Tamaño de celdas**: Reducir de 80x80px a 60x60px (aproximadamente)
- **Padding**: Reducir espacios internos
- **Font**: Números de día más pequeños (14px → 12px)
- **Grid**: Mantener 7 columnas (dom-sab)
- **Mantener**: Navegación mes anterior/siguiente, nombre del mes

### RF-03: Layout Mejorado del Día en Calendario

- **Estructura de la celda**:
  ```
  [Número día]
  (centrado arriba)
  
  ● ● ●
  (puntos de color alineados izquierda, verticalmente centrados)
  ```
- **Posicionamiento de número**:
  - Texto-align: center
  - Posición: arriba (top)
  - Font-weight: bold
  - Font-size: 12px
- **Posicionamiento de puntos**:
  - Flex row wrap
  - Gap pequeño (2px)
  - Alineados a la izquierda (flex-start)
  - Máximo 3 puntos visibles en calendario (si más, mostrar "+N")
  - Tamaño: 1.5px de diámetro (pequeños, sutiles)

### RF-04: Expansión de Fecha

- **Trigger**: Click en cualquier celda del calendario
- **Animación**: Expansión suave (transform scale, opacity fade-in)
- **Modal/Panel expandido**: Muestra:
  - Fecha grande formateada en español ("10 de diciembre de 2025")
  - Lista de tareas de ese día (todos los miembros)
  - Por cada tarea:
    - Dot de color del creador
    - Nombre del miembro
    - Nombre/descripción de tarea
    - Hora (si existe)
    - Badge con prioridad (Alta/Media/Baja)
    - Estado visual (opacidad si completada)
  - Botón para cerrar o hacer click fuera para cerrar
- **Empty state**: Mensaje si no hay tareas ese día
- **Mobile**: Fullscreen o bottom sheet
- **Desktop**: Modal centrado (max-width: 500px)

### RF-05: Sincronización Calendario-Tareas

- **Tareas compartidas**: Los datos de tareas vienen de un array único (localStorage o context)
- **Colores**: Cada tarea hereda el color del miembro creador
- **Filtrado**: 
  - Calendario muestra puntos de todas las tareas
  - "Mis Tareas" solo muestra tareas del usuario actual (`usuarioId` === `tarea.creadorId`)

## Requisitos No Funcionales

### RNF-01: Rendimiento

- Máximo 100 tareas por familia sin lag
- Cálculos de filtro (día/semana/mes) en O(n)
- Re-renders optimizados con useMemo para fechas

### RNF-02: Accesibilidad (WCAG AA)

- aria-label en cada celda: "10 de diciembre, 2 tareas"
- Botones expandir con aria-expanded
- Teclado: Enter/Space para expandir, Escape para cerrar
- Suficiente contraste en puntos de color (min 3:1)

### RNF-03: Responsive

- Móvil (<640px): Calendario 7 columnas compacto, pestaña "Mis Tareas" full-width
- Tablet (640px-1024px): Calendario + lista lado a lado
- Desktop (>1024px): Igual a tablet

### RNF-04: Seguridad

- Validar que usuarioId del usuario autenticado coincida antes de mostrar/editar tareas
- No mostrar tareas de otros usuarios a menos que sea visualización de familia

## Estructura de Datos

### Interfaz Tarea (actualizada)

```typescript
export interface Tarea {
  id: string
  titulo: string
  descripcion?: string
  fecha: string // ISO date: "2025-12-10"
  hora?: string // Opcional: "14:30"
  creadorId: string // ID del miembro que creó
  colorCreador: ColorMiembro // Color del creador
  prioridad?: "baja" | "media" | "alta"
  completada: boolean
  miembrosAsignados?: string[]
  familiaId: string
  createdAt: string
  updatedAt: string
}
```

### Estructura en localStorage

```typescript
// "tareas" - Array de todas las tareas
const tareas: Tarea[] = [
  {
    id: "tarea-1",
    titulo: "Comprar verduras",
    fecha: "2025-12-10",
    creadorId: "miembro-1",
    colorCreador: { nombre: "Azul", bg: "#3B82F6", text: "#FFFFFF" },
    prioridad: "alta",
    completada: false,
    familiaId: "familia-1"
  }
]
```

## Componentes a Crear/Actualizar

### Nuevos Componentes

1. **`components/tareas-tab.tsx`**
   - Props: tareas: Tarea[], usuarioId: string, filtro: "dia" | "semana" | "mes"
   - Mostrar lista de tareas filtradas del usuario
   - Controles de filtro (3 botones)
   - Contador de pendientes/completadas

2. **`components/fecha-expandida-modal.tsx`**
   - Props: fecha: Date, tareas: Tarea[], onClose: () => void
   - Modal/panel con tareas del día
   - Animación suave
   - Responsive

### Componentes Actualizados

1. **`components/calendario-section.tsx`**
   - Agregar tabs: "Calendario" | "Mis Tareas"
   - Reducir tamaño de celdas (60x60px)
   - Ajustar layout de puntos y número
   - Agregar handler para click en fecha (setFechaSeleccionada)
   - Integrar modal de expansión
   - Cargar tareas desde localStorage
   - Pasar usuarioId a TareasTab

2. **`lib/types.ts`**
   - Actualizar interfaz Tarea o crear nueva

## Casos de Uso

### CU-01: Ver Mis Tareas del Día
1. Usuario abre app
2. Va a sección Calendario
3. Hace click en pestaña "Mis Tareas"
4. Selecciona filtro "Día"
5. Ve solo tareas de hoy en orden cronológico
6. Sistema muestra contador "3 pendientes, 1 completada"

### CU-02: Expandir Fecha en Calendario
1. Usuario ve calendario con puntos de color
2. Hace click en la celda del 10 de diciembre
3. Calendar se expande levemente (animación)
4. Muestra modal/panel con todas las tareas de ese día
5. Ve color de cada miembro, nombre y detalles
6. Hace click en X o fuera para cerrar

### CU-03: Filtrar Tareas por Semana
1. Usuario está en "Mis Tareas"
2. Selecciona filtro "Semana"
3. Sistema calcula próximos 7 días
4. Muestra solo tareas de ese rango
5. Ordenadas por fecha y hora

## Mockups ASCII

### Pestaña Mis Tareas

```
┌─────────────────────────────────────┐
│ Mis Tareas  ├─────────────────────┤ │
│                                     │
│ Filtro: [Día] [Semana] [Mes]       │
│                                     │
│ 3 tareas pendientes, 1 completada   │
│                                     │
│ ● Azul - Comprar verduras           │
│   Hoy, 14:30 | Alta                 │
│                                     │
│ ● Rosa - Limpiar sala               │
│   Hoy, 16:00 | Media | ✓ Completada│
│                                     │
│ ● Verde - Preparar almuerzo         │
│   Mañana, 12:00 | Media             │
│                                     │
└─────────────────────────────────────┘
```

### Calendario Compacto con Expansión

```
Dic 2025
Dom Lun Mar Mié Jue Vie Sáb
                 1   2   3
 4   5   6   7   8   9   10
11  12  13  14  15  16   17

(Click en 10)
↓
┌─────────────────────────────┐
│ 10 de diciembre de 2025     │
├─────────────────────────────┤
│ ● Azul - Comprar verduras   │
│   10:00 | Alta              │
│                             │
│ ● Rosa - Limpiar sala       │
│   14:30 | Media | ✓         │
│                             │
│ ● Verde - Tareas del hogar  │
│   16:00 | Baja              │
│                    [Cerrar] │
└─────────────────────────────┘
```

## Criterios de Aceptación

- [ ] Pestaña "Mis Tareas" muestra solo tareas del usuario actual
- [ ] Filtros día/semana/mes funcionan correctamente
- [ ] Tareas ordenadas cronológicamente
- [ ] Contador de pendientes/completadas preciso
- [ ] Calendario compacto (60x60px) con puntos alineados izquierda
- [ ] Número de día centrado arriba
- [ ] Click en fecha expande con animación
- [ ] Modal muestra todas las tareas del día con detalles
- [ ] Responsive en móvil, tablet, desktop
- [ ] WCAG AA compliant (aria-labels, contraste, navegación teclado)
- [ ] Sin errores TypeScript
- [ ] Sin errores en consola

## Consideraciones Técnicas

### Cálculos de Fechas

```typescript
// Filtro día
const hoy = new Date()
const tareasHoy = tareas.filter(t => isSameDay(new Date(t.fecha), hoy))

// Filtro semana
const inicioSemana = startOfWeek(new Date())
const finSemana = endOfWeek(new Date())
const tareasSemana = tareas.filter(t => {
  const fecha = new Date(t.fecha)
  return fecha >= inicioSemana && fecha <= finSemana
})

// Filtro mes
const inicioMes = startOfMonth(new Date())
const finMes = endOfMonth(new Date())
const tareasMes = tareas.filter(t => {
  const fecha = new Date(t.fecha)
  return fecha >= inicioMes && fecha <= finMes
})
```

### Animaciones

```css
/* Expansión suave */
@keyframes expandir {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
```

### Performance

- Usar `useMemo` para tareas filtradas
- Usar `useCallback` para handlers
- Lazy load modal solo cuando se expande

## Roadmap de Implementación

1. **Fase 1**: Crear componente TareasTab con filtros
2. **Fase 2**: Actualizar CalendarioSection con tabs
3. **Fase 3**: Ajustar layout calendario (tamaño, puntos, número)
4. **Fase 4**: Crear FechaExpandidaModal
5. **Fase 5**: Integrar expansión en calendario
6. **Fase 6**: Testing y refinamientos responsive

## Referencias

- SPEC-02: Notas con Color del Miembro Creador (patrón de colores)
- SPEC-04: Leaderboard (patrón de visualización de miembros)
- date-fns: Para cálculos de fechas
- Tailwind CSS: Para responsive y animaciones
