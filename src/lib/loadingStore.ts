import { create } from 'zustand';

interface LoadingStore {
  robotLoaded: boolean;
  fontsLoaded: boolean;
  imagesLoaded: boolean;
  setRobotLoaded: () => void;
  setFontsLoaded: () => void;
  setImagesLoaded: () => void;
  isFullyLoaded: () => boolean;
}

export const useLoadingStore = create<LoadingStore>((set, get) => ({
  robotLoaded: false,
  fontsLoaded: false,
  imagesLoaded: false,
  setRobotLoaded: () => set({ robotLoaded: true }),
  setFontsLoaded: () => set({ fontsLoaded: true }),
  setImagesLoaded: () => set({ imagesLoaded: true }),
  isFullyLoaded: () => {
    const { robotLoaded, fontsLoaded, imagesLoaded } = get();
    return robotLoaded && fontsLoaded && imagesLoaded;
  },
}));