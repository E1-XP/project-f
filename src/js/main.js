import Store from './source/store';
import View from './source/view';
import Controller from './source/controller';

import Preloader from './components/preloader';
import MainPage from './components/mainpage';
import Navigation from './components/navigation';
import Slider from './components/slider';

import initialState from './state';

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
