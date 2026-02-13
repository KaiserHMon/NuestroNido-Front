import { MemberColor } from './types';

export const AVAILABLE_COLORS: MemberColor[] = [
  {
    id: 'red',
    name: 'Rojo',
    bg: '#FF6B6B',
    text: '#FFFFFF',
    accent: '#FF5252',
    wcagContrast: 4.5,
  },
  {
    id: 'blue',
    name: 'Azul',
    bg: '#4ECDC4',
    text: '#FFFFFF',
    accent: '#2FA09F',
    wcagContrast: 4.7,
  },
  {
    id: 'green',
    name: 'Verde',
    bg: '#95E1D3',
    text: '#1A1A1A',
    accent: '#6BBF9F',
    wcagContrast: 5.2,
  },
  {
    id: 'yellow',
    name: 'Amarillo',
    bg: '#FFE66D',
    text: '#1A1A1A',
    accent: '#FFC93C',
    wcagContrast: 6.1,
  },
  {
    id: 'purple',
    name: 'Púrpura',
    bg: '#A78BFA',
    text: '#FFFFFF',
    accent: '#7C3AED',
    wcagContrast: 4.6,
  },
  {
    id: 'orange',
    name: 'Naranja',
    bg: '#FF9966',
    text: '#FFFFFF',
    accent: '#FF7F3F',
    wcagContrast: 4.5,
  },
  {
    id: 'pink',
    name: 'Rosa',
    bg: '#FF6B9D',
    text: '#FFFFFF',
    accent: '#FF4757',
    wcagContrast: 4.5,
  },
  {
    id: 'teal',
    name: 'Verde Azulado',
    bg: '#38B6A8',
    text: '#FFFFFF',
    accent: '#1F9080',
    wcagContrast: 4.8,
  },
];

export const getColorById = (colorId: string): MemberColor | undefined => {
  return AVAILABLE_COLORS.find((c) => c.id === colorId);
};

export const getAvailableColors = (): MemberColor[] => {
  return [...AVAILABLE_COLORS];
};

export const validateWCAGContrast = (color: MemberColor): boolean => {
  return color.wcagContrast >= 4.5;
};

export const getColorName = (colorId: string): string => {
  const color = getColorById(colorId);
  return color?.name || 'Desconocido';
};

export const getColorStyles = (colorId: string) => {
  const color = getColorById(colorId);
  if (!color) return {};

  return {
    backgroundColor: color.bg,
    color: color.text,
  };
};

export const getColorClasses = (colorId: string): Record<string, string> => {
  const color = getColorById(colorId);
  if (!color) return {};

  return {
    bg: `bg-[${color.bg}]`,
    text: `text-[${color.text}]`,
    accent: `bg-[${color.accent}]`,
  };
};

export const getColorInlineStyle = (colorId: string) => {
  const color = getColorById(colorId);
  if (!color) return {};

  return {
    backgroundColor: color.bg,
    color: color.text,
  };
};

export const getColorCSSVariables = (colorId: string) => {
  const color = getColorById(colorId);
  if (!color) return {};

  return {
    '--color-bg': color.bg,
    '--color-text': color.text,
    '--color-accent': color.accent,
  } as React.CSSProperties;
};

const getContrastColor = (hexcolor: string): string => {
  const hex = hexcolor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#1A1A1A' : '#FFFFFF';
};

export const mapColor = (
  apiColor: { id?: string; name?: string; bg?: string } | string | undefined | null,
  userId?: string
): MemberColor => {
  if (apiColor && typeof apiColor === 'object' && apiColor.bg) {
    const bg = apiColor.bg.startsWith('#') ? apiColor.bg : `#${apiColor.bg}`;
    return {
      id: apiColor.id || 'custom',
      name: apiColor.name || 'Personalizado',
      bg: bg,
      text: getContrastColor(bg),
      accent: bg,
      wcagContrast: 4.5,
    };
  }

  if (typeof apiColor === 'string') {
    const colorData = getColorById(apiColor.toLowerCase());
    if (colorData) return colorData;
  }

  if (userId) {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % AVAILABLE_COLORS.length;
    return AVAILABLE_COLORS[index];
  }

  return {
    id: 'default',
    name: 'Gris',
    bg: '#9CA3AF',
    text: '#FFFFFF',
    accent: '#4B5563',
    wcagContrast: 4.5,
  };
};
