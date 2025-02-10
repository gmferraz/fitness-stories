import { MMKV } from 'react-native-mmkv';
import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';
import { LayoutType } from './get-available-layouts';

export type FontFamily = 'Inter' | 'Oswald' | 'Montserrat' | 'Poppins';
export type ColorScheme = 'blue' | 'purple' | 'pink' | 'orange' | 'green';
export type BackgroundColor =
  | 'dark'
  | 'white'
  | 'blue-200'
  | 'purple-600'
  | 'red-200'
  | 'orange-200';
export type FontColor = 'black' | 'gray-700' | 'gray-800' | 'gray-900' | 'white';
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
  fontColor: 'white',
  iconColor: 'blue',
  backgroundColor: 'dark',
  showBackground: true,
};

const DEFAULT_LAYOUT_STYLES: Record<LayoutType, LayoutStyle> = {
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
    fontFamily: 'Oswald',
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
            [layout]: { ...state.styles[layout], ...style },
          },
        })),

      setActiveLayout: (layout) => set({ activeLayout: layout }),

      resetLayoutStyle: (layout) =>
        set((state) => ({
          styles: {
            ...state.styles,
            [layout]: DEFAULT_LAYOUT_STYLES[layout],
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
      name: 'layout-styles-storage-v2',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

export function getFontColor(color: FontColor): string {
  switch (color) {
    case 'black':
      return '#000000';
    case 'gray-900':
      return '#111827';
    case 'gray-800':
      return '#1F2937';
    case 'gray-700':
      return '#374151';
    case 'white':
      return '#FFFFFF';
  }
}

export function getBackgroundColor(color: BackgroundColor): string {
  switch (color) {
    case 'dark':
      return 'rgb(21, 21, 24)';
    case 'white':
      return '#FFFFFF';
    case 'blue-200':
      return '#BFDBFE';
    case 'purple-600':
      return '#9333EA';
    case 'red-200':
      return '#FECACA';
    case 'orange-200':
      return '#FED7AA';
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
