import Store from './source/store';
import View from './source/view';
import Controller from './source/controller';

import Preloader from './components/preloader';
import MainPage from './components/mainpage';
import Navigation from './components/navigation';

const initialState = {
    isLoading: true,
    isNavOpen: false,
    images: []
}

const App = () => {
    const store = new Store(initialState);

    const controller = new Controller(store);
    //const view = new View(store);
    //views
    const preloader = new Preloader(store);
    const mainPage = new MainPage(store);
    const navigation = new Navigation(store);
};
document.addEventListener('DOMContentLoaded', App);
