export interface State {
  isLoading: boolean;
  loadStatus: number;
  images: any[];
  imageCache: HTMLImageElement[];
}

export const initialState: State = {
  isLoading: true,
  loadStatus: 0,
  images: [],
  imageCache: []
};
