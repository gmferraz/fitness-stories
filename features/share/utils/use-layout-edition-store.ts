import { MMKV } from 'react-native-mmkv';
import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';
import { LayoutType } from './get-available-layouts';
import { Appearance } from 'react-native';
import { applyOpacityToColor } from './apply-opacity-to-color';

export type FontFamily = 'Inter' | 'Oswald' | 'Montserrat' | 'Poppins';
export type ColorScheme = 'blue' | 'purple' | 'pink' | 'orange' | 'green';
export type BackgroundColor =
  | 'white'
  | 'black'
  | 'pastel-pink'
  | 'pastel-blue'
  | 'pastel-purple'
  | 'pastel-green'
  | 'pastel-mint'
  | 'pastel-lavender'
  | 'pastel-coral'
  | 'pastel-turquoise'
  | 'pastel-mauve'
  | 'pastel-sky-blue'
  | 'pastel-gray'
  | 'vibrant-blue'
  | 'vibrant-purple'
  | 'vibrant-pink'
  | 'vibrant-teal'
  | 'vibrant-orange'
  | 'vibrant-red'
  | 'vibrant-gray';
export type FontColor =
  | 'white'
  | 'black'
  | 'slate-blue-gray'
  | 'soft-burgundy'
  | 'moderate-plum'
  | 'dark-olive-green'
  | 'deep-teal'
  | 'moderate-indigo'
  | 'slate-gray'
  | 'dark-brown'
  | 'forest-green'
  | 'charcoal'
  | 'midnight-blue'
  | 'espresso-brown'
  | 'iron-gray'
  | 'deep-aubergine';
export type IconColor = 'blue' | 'purple' | 'pink' | 'orange' | 'green' | 'white' | 'gray';

const envStorage = new MMKV({
  id: 'layout-storage',
});

export const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return envStorage.set(name, value);
  },
  getItem: (name) => {
    const value = envStorage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return envStorage.delete(name);
  },
};

interface LayoutStyle {
  fontFamily: FontFamily;
  titleSize: number;
  bodySize: number;
  labelSize: number;
  fontColor: FontColor;
  iconColor: IconColor;
  backgroundColor: BackgroundColor;
  showBackground: boolean;
  isEdited: boolean;
  padding: number;
  opacity: number;
}

interface LayoutStylesState {
  styles: Record<LayoutType, LayoutStyle>;
  activeLayout: LayoutType | null;
  lastUsedLayout: LayoutType | null;

  // Actions
  setLayoutStyle: (layout: LayoutType, style: Partial<LayoutStyle>) => void;
  setActiveLayout: (layout: LayoutType) => void;
  resetLayoutStyle: (layout: LayoutType) => void;
  setLastUsedLayout: (layout: LayoutType | null) => void;
  toggleBackground: () => void;
}

const DEFAULT_STYLE: LayoutStyle = {
  fontFamily: 'Inter',
  titleSize: 28,
  bodySize: 18,
  labelSize: 14,
  fontColor: Appearance.getColorScheme() === 'dark' ? 'white' : 'black',
  iconColor: 'blue',
  backgroundColor: Appearance.getColorScheme() === 'dark' ? 'black' : 'white',
  showBackground: true,
  isEdited: false,
  padding: 16,
  opacity: 90,
};

export const DEFAULT_LAYOUT_STYLES: Record<LayoutType, LayoutStyle> = {
  minimal: {
    ...DEFAULT_STYLE,
    titleSize: 24,
    bodySize: 16,
  },
  social: {
    ...DEFAULT_STYLE,
    fontFamily: 'Poppins',
    titleSize: 32,
    bodySize: 16,
  },
  detailed: {
    ...DEFAULT_STYLE,
    fontFamily: 'Montserrat',
    titleSize: 28,
    bodySize: 18,
  },
  progress: {
    ...DEFAULT_STYLE,
    fontFamily: 'Inter',
    titleSize: 26,
    bodySize: 16,
  },
  map: {
    ...DEFAULT_STYLE,
    fontFamily: 'Poppins',
    titleSize: 30,
    bodySize: 18,
  },
  stats: {
    ...DEFAULT_STYLE,
    fontFamily: 'Poppins',
    titleSize: 28,
    bodySize: 18,
  },
  aesthetic: {
    ...DEFAULT_STYLE,
    fontFamily: 'Montserrat',
    titleSize: 32,
    bodySize: 20,
  },
  achievement: {
    ...DEFAULT_STYLE,
    fontFamily: 'Inter',
    titleSize: 26,
    bodySize: 16,
  },
  weight: {
    ...DEFAULT_STYLE,
    fontFamily: 'Oswald',
    titleSize: 28,
    bodySize: 18,
  },
  'period-minimal': {
    ...DEFAULT_STYLE,
    fontFamily: 'Inter',
    titleSize: 24,
    bodySize: 16,
  },
  'period-stats': {
    ...DEFAULT_STYLE,
    fontFamily: 'Inter',
    titleSize: 24,
    bodySize: 16,
  },
  'period-social': {
    ...DEFAULT_STYLE,
    fontFamily: 'Inter',
    titleSize: 24,
    bodySize: 16,
  },
  hiit: {
    ...DEFAULT_STYLE,
    fontFamily: 'Poppins',
    titleSize: 32,
    bodySize: 20,
  },
  hiit2: {
    ...DEFAULT_STYLE,
    fontFamily: 'Montserrat',
    titleSize: 36,
    bodySize: 22,
  },
};

export const useLayoutEditionStore = create<LayoutStylesState>()(
  persist(
    (set) => ({
      styles: DEFAULT_LAYOUT_STYLES,
      activeLayout: null,
      lastUsedLayout: null,

      setLayoutStyle: (layout, style) =>
        set((state) => ({
          styles: {
            ...state.styles,
            [layout]: { ...state.styles[layout], ...style, isEdited: true },
          },
        })),

      setActiveLayout: (layout) =>
        set((state) => {
          return {
            activeLayout: layout,
            styles: {
              ...state.styles,
              [layout]: {
                ...state.styles[layout],
                showBackground: state.styles[layout]?.showBackground ?? true,
              },
            },
          };
        }),

      resetLayoutStyle: (layout) =>
        set((state) => ({
          styles: {
            ...state.styles,
            [layout]: {
              ...DEFAULT_LAYOUT_STYLES[layout],
              showBackground: state.styles[layout]?.showBackground ?? true,
              isEdited: false,
            },
          },
        })),

      setLastUsedLayout: (layout) => set({ lastUsedLayout: layout }),

      toggleBackground: () =>
        set((state) => {
          if (state.activeLayout) {
            const currentLayout = state.styles[state.activeLayout];
            return {
              styles: {
                ...state.styles,
                [state.activeLayout]: {
                  ...currentLayout,
                  showBackground: !currentLayout.showBackground,
                },
              },
            };
          }
          return state;
        }),
    }),
    {
      name: 'layout-styles-storage-v17',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

export function getFontColor(color: FontColor): string {
  switch (color) {
    case 'white':
      return '#FFFFFF';
    case 'black':
      return '#000000';
    case 'slate-blue-gray':
      return '#37474F';
    case 'soft-burgundy':
      return '#880E4F';
    case 'moderate-plum':
      return '#5D3A6A';
    case 'dark-olive-green':
      return '#3B3F2B';
    case 'deep-teal':
      return '#00796B';
    case 'moderate-indigo':
      return '#283593';
    case 'slate-gray':
      return '#455A64';
    case 'dark-brown':
      return '#4E342E';
    case 'forest-green':
      return '#2E7D32';
    case 'charcoal':
      return '#212121';
    case 'midnight-blue':
      return '#0D47A1';
    case 'espresso-brown':
      return '#3E2723';
    case 'iron-gray':
      return '#616161';
    case 'deep-aubergine':
      return '#4B0082';
  }
}

export function getBackgroundColor(color: BackgroundColor, opacity = 100): string {
  switch (color) {
    case 'white':
      return applyOpacityToColor('#FFFFFF', opacity);
    case 'black':
      return applyOpacityToColor('rgb(21, 21, 24)', opacity);
    case 'pastel-pink':
      return applyOpacityToColor('#FFC1CC', opacity);
    case 'pastel-blue':
      return applyOpacityToColor('#A2D2FF', opacity);
    case 'pastel-purple':
      return applyOpacityToColor('#CDB4DB', opacity);
    case 'pastel-green':
      return applyOpacityToColor('#BFD8B8', opacity);
    case 'pastel-mint':
      return applyOpacityToColor('#CFF9E1', opacity);
    case 'pastel-lavender':
      return applyOpacityToColor('#E3D0FF', opacity);
    case 'pastel-coral':
      return applyOpacityToColor('#FFAAA7', opacity);
    case 'pastel-turquoise':
      return applyOpacityToColor('#B2DFDB', opacity);
    case 'pastel-mauve':
      return applyOpacityToColor('#F1E1FF', opacity);
    case 'pastel-sky-blue':
      return applyOpacityToColor('#B3E5FC', opacity);
    case 'pastel-gray':
      return applyOpacityToColor('#E0E0E0', opacity);
    case 'vibrant-blue':
      return applyOpacityToColor('#1E88E5', opacity);
    case 'vibrant-purple':
      return applyOpacityToColor('#8E24AA', opacity);
    case 'vibrant-pink':
      return applyOpacityToColor('#EC407A', opacity);
    case 'vibrant-teal':
      return applyOpacityToColor('#00ACC1', opacity);
    case 'vibrant-orange':
      return applyOpacityToColor('#FF7043', opacity);
    case 'vibrant-red':
      return applyOpacityToColor('#E53935', opacity);
    case 'vibrant-gray':
      return applyOpacityToColor('#8E8E93', opacity);
  }
}

export function getIconColor(color: IconColor): string {
  switch (color) {
    case 'blue':
      return '#007AFF';
    case 'purple':
      return '#5856D6';
    case 'pink':
      return '#FF2D55';
    case 'orange':
      return '#FF9500';
    case 'green':
      return '#34C759';
    case 'white':
      return '#FFFFFF';
    case 'gray':
      return '#8E8E93';
  }
}
