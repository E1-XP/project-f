export interface State {
  isLoading: boolean;
  loadStatus: number;
  isMenuOpen: boolean;
  isSliderRunning: boolean;
  currentSlide: number;
  currentPart: number;
  images: any[];
  extractedColors: any[];
}

export const initialState: Partial<State> = {
  isLoading: true,
  loadStatus: 0,
  isMenuOpen: false,
  isSliderRunning: true,
  images: [],
  currentSlide: 0,
  currentPart: 1,
  extractedColors: []
};
