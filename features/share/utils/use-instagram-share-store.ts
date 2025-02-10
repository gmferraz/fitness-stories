import { create } from 'zustand';
import { LayoutType } from './get-available-layouts';

export type ShareStep = 'photo' | 'layout';

interface InstagramShareStore {
  selectedImage: string | null;
  selectedLayout: LayoutType | null;
  lastUsedLayout: LayoutType | null;
  step: ShareStep;
  setSelectedImage: (image: string | null) => void;
  setSelectedLayout: (layout: LayoutType | null) => void;
  setLastUsedLayout: (layout: LayoutType | null) => void;
  setStep: (step: ShareStep) => void;
  reset: () => void;
}

export const useInstagramShareStore = create<InstagramShareStore>((set) => ({
  selectedImage: null,
  selectedLayout: null,
  lastUsedLayout: null,
  step: 'photo',
  setSelectedImage: (image) => set({ selectedImage: image }),
  setSelectedLayout: (layout) => set({ selectedLayout: layout }),
  setLastUsedLayout: (layout) => set({ lastUsedLayout: layout }),
  setStep: (step) => set({ step }),
  reset: () => set({ selectedImage: null, selectedLayout: null, step: 'photo' }),
}));
