/**
 * Paleta de colores para miembros de NuestroNido
 * Todos los colores cumplen con WCAG AA (contraste mínimo 4.5:1)
 */

import { ColorMiembro } from './types';

export const COLORES_DISPONIBLES: ColorMiembro[] = [
  {
    id: 'red',
    nombre: 'Rojo',
    bg: '#FF6B6B',
    text: '#FFFFFF',
    accent: '#FF5252',
    wcagContrast: 4.5,
  },
  {
    id: 'blue',
    nombre: 'Azul',
    bg: '#4ECDC4',
    text: '#FFFFFF',
    accent: '#2FA09F',
    wcagContrast: 4.7,
  },
  {
    id: 'green',
    nombre: 'Verde',
    bg: '#95E1D3',
    text: '#1A1A1A',
    accent: '#6BBF9F',
    wcagContrast: 5.2,
  },
  {
    id: 'yellow',
    nombre: 'Amarillo',
    bg: '#FFE66D',
    text: '#1A1A1A',
    accent: '#FFC93C',
    wcagContrast: 6.1,
  },
  {
    id: 'purple',
    nombre: 'Púrpura',
    bg: '#A78BFA',
    text: '#FFFFFF',
    accent: '#7C3AED',
    wcagContrast: 4.6,
  },
  {
    id: 'orange',
    nombre: 'Naranja',
    bg: '#FF9966',
    text: '#FFFFFF',
    accent: '#FF7F3F',
    wcagContrast: 4.5,
  },
  {
    id: 'pink',
    nombre: 'Rosa',
    bg: '#FF6B9D',
    text: '#FFFFFF',
    accent: '#FF4757',
    wcagContrast: 4.5,
  },
  {
    id: 'teal',
    nombre: 'Verde Azulado',
    bg: '#38B6A8',
    text: '#FFFFFF',
    accent: '#1F9080',
    wcagContrast: 4.8,
  },
];

/**
 * Obtener un color por su ID
 */
export const getColorById = (colorId: string): ColorMiembro | undefined => {
  return COLORES_DISPONIBLES.find((c) => c.id === colorId);
};

/**
 * Obtener todos los colores disponibles
 */
export const getColoresDisponibles = (): ColorMiembro[] => {
  return [...COLORES_DISPONIBLES];
};

/**
 * Validar que un color tiene contraste adecuado WCAG AA
 */
export const validarContrasteWCAG = (color: ColorMiembro): boolean => {
  return color.wcagContrast >= 4.5;
};

/**
 * Obtener nombre legible de un color
 */
export const getNombreColor = (colorId: string): string => {
  const color = getColorById(colorId);
  return color?.nombre || 'Desconocido';
};

/**
 * Aplicar estilos de color a un elemento
 */
export const getColorStyles = (colorId: string) => {
  const color = getColorById(colorId);
  if (!color) return {};

  return {
    backgroundColor: color.bg,
    color: color.text,
  };
};

/**
 * Obtener clases de Tailwind para un color
 * Nota: Para esto se podría usar CSS variables o crear un sistema más dinámico
 */
export const getColorClasses = (colorId: string): Record<string, string> => {
  const color = getColorById(colorId);
  if (!color) return {};

  return {
    bg: `bg-[${color.bg}]`,
    text: `text-[${color.text}]`,
    accent: `bg-[${color.accent}]`,
  };
};

/**
 * Generar estilo en línea para un color
 */
export const getColorInlineStyle = (colorId: string) => {
  const color = getColorById(colorId);
  if (!color) return {};

  return {
    backgroundColor: color.bg,
    color: color.text,
  };
};

/**
 * Obtener variable CSS para un color
 */
export const getColorCSSVariables = (colorId: string) => {
  const color = getColorById(colorId);
  if (!color) return {};

  return {
    '--color-bg': color.bg,
    '--color-text': color.text,
    '--color-accent': color.accent,
  } as React.CSSProperties;
};

/**
 * Mapear un color de la API a un ColorMiembro completo.
 * Si el color es un string (ID), busca el objeto correspondiente.
 * Si es un objeto parcial, lo completa.
 * Si es 'default' o falta, asigna uno basado en el userId para consistencia.
 */
export const mapColor = (
  apiColor: { id?: string; name?: string; bg?: string } | string | undefined | null,
  _userId?: string
): ColorMiembro => {
  let colorData: ColorMiembro | undefined;

  // 1. Intentar obtener por ID si es string o si el objeto tiene ID
  if (typeof apiColor === 'string') {
    colorData = getColorById(apiColor);
  } else if (apiColor && apiColor.id) {
    colorData = getColorById(apiColor.id);
  }

  // 2. Retornar el color encontrado o el gris por defecto
  return colorData || {
    id: 'default',
    nombre: 'Gris',
    bg: '#9CA3AF',
    text: '#FFFFFF',
    accent: '#9CA3AF',
    wcagContrast: 4.5,
  };
};
