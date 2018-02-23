import Store from './source/store';
import View from './source/view';
import Controller from './source/controller';

import Preloader from './components/preloader';
import MainPage from './components/mainpage';
import Navigation from './components/navigation';
import Slider from './components/slider';

const initialState = {
    isLoading: true,
    isLoadingNewPart: false,
    isNavOpen: false,
    isSliderRunning: false,
    interval: 3000,
    currentPart: 0,
    loadedPart: 1,
    currentImage: "",
    images: [],
    navThumbnails: []
}

const App = () => {
    const store = new Store(initialState);
    const controller = new Controller(store);
    //views
    const preloader = new Preloader(store, controller);
    const mainPage = new MainPage(store, controller);
    const navigation = new Navigation(store, controller);
    const slider = new Slider(store, controller);
};
document.addEventListener('DOMContentLoaded', App);
