export interface State {
  isLoading: boolean;
  loadStatus: number;
  isSliderRunning: boolean;
  currentSlide: number;
  images: any[];
  extractedColors: any[];
}

export const initialState: Partial<State> = {
  isLoading: true,
  loadStatus: 0,
  isSliderRunning: true,
  images: [],
  currentSlide: 0,
  extractedColors: []
};
