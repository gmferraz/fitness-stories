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

interface LayoutEditionState {
  // Font customization
  fontFamily: FontFamily;
  titleSize: number;
  bodySize: number;
  labelSize: number;
  fontColor: FontColor;

  // Style customization
  iconColor: IconColor;
  backgroundColor: BackgroundColor;
  lastUsedLayout: LayoutType | null;
  showBackground: boolean;
  hasCustomEdits: boolean;

  // Actions
  setFontFamily: (family: FontFamily) => void;
  setTitleSize: (size: number) => void;
  setBodySize: (size: number) => void;
  setLabelSize: (size: number) => void;
  setFontColor: (color: FontColor) => void;
  setIconColor: (color: IconColor) => void;
  setBackgroundColor: (color: BackgroundColor) => void;
  setLastUsedLayout: (layout: LayoutType | null) => void;
  toggleBackground: () => void;
  resetEdits: () => void;
}

const DEFAULT_STATE = {
  fontFamily: 'Inter' as FontFamily,
  titleSize: 28,
  bodySize: 18,
  labelSize: 14,
  fontColor: 'black' as FontColor,
  iconColor: 'blue' as IconColor,
  backgroundColor: 'dark' as BackgroundColor,
  lastUsedLayout: null as LayoutType | null,
  showBackground: true,
  hasCustomEdits: false,
};

export const useLayoutEditionStore = create<LayoutEditionState>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,

      setFontFamily: (family) => set((state) => ({ fontFamily: family, hasCustomEdits: true })),

      setTitleSize: (size) => set((state) => ({ titleSize: size, hasCustomEdits: true })),

      setBodySize: (size) => set((state) => ({ bodySize: size, hasCustomEdits: true })),

      setLabelSize: (size) => set((state) => ({ labelSize: size, hasCustomEdits: true })),

      setFontColor: (color) => set((state) => ({ fontColor: color, hasCustomEdits: true })),

      setIconColor: (color) =>
        set((state) => ({
          ...state,
          iconColor: color,
          hasCustomEdits: true,
        })),

      setBackgroundColor: (color) =>
        set((state) => ({ backgroundColor: color, hasCustomEdits: true })),

      setLastUsedLayout: (layout) => set((state) => ({ lastUsedLayout: layout })),

      toggleBackground: () => set((state) => ({ showBackground: !state.showBackground })),

      resetEdits: () => set(DEFAULT_STATE),
    }),
    {
      name: 'layout-edition-storage',
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
