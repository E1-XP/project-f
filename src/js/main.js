import Store from './source/store';
import View from './source/view';
import Controller from './source/controller';

import Preloader from './components/preloader';

const initialState = {
    isLoading: true,
    images: []
}

const App = () => {
    const store = new Store(initialState);

    const controller = new Controller(store);
    //const view = new View(store);
    //views
    const preloader = new Preloader(store);
};
document.addEventListener('DOMContentLoaded', App);
