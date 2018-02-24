import View from '../source/view';
export default class MainPage extends View {
    constructor(model, controller) {
        super(model, controller);
        this.DOM = {}
        //this.DOM.mainPage = 
    }
    attachHandlers() {
        document.querySelector('.js-navigation_button-full').addEventListener('click', this.handleNavigationButtonFullScreen.bind(this));
        document.querySelector('.js-navigation_button').addEventListener('click', this.handleHeaderNavigationButton.bind(this));
        document.getElementById('js-thumbnail_gallery').addEventListener('click', this.toggleThumbnailGallery.bind(this));
    }

    toggleThumbnailGallery() {
        document.querySelector('.c-slider_navigation-thumbnails').classList.toggle('is-open');
    }

    handleNavigationButtonFullScreen() {
        document.querySelector('.l-main_page').classList.remove('is-open');
        document.querySelector('.js-navigation_button-full').classList.remove('is-open');
        document.querySelector('.l-main_navigation').classList.remove('is-open');
        this.setState({ isNavOpen: false });
    }
    handleHeaderNavigationButton() {
        document.querySelector('.l-main_page').classList.add('is-open');
        setTimeout(() => document.querySelector('.l-main_navigation').classList.add('is-open'), 500);
        this.setState({ isNavOpen: true });
    }

    render() {
        // const self = this;
        //console.log(this.model.state);
        //console.log(this.DOM);
        // if (document.querySelector('.main_page').classList.contains('is-open')) 
        if (this.model.state.isNavOpen) document.querySelector('.js-navigation_button-full').classList.add('is-open'); // if (!this.model.state.isLoading) this.preloader.classList.remove('is-open');
        //if (this.model.state.images) console.log('imgs arrived!');
    }
}