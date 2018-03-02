import View from '../source/view';

export default class MainPage extends View {
    constructor(model, controller) {
        super(model, controller);

        this.setFooter();
    }
    attachHandlers() {
        document.querySelector('.js-navigation_button-full').addEventListener('click', this.handleNavigationButtonFullScreen.bind(this));
        document.getElementById('js-change-section').addEventListener('click', this.handleHeaderNavigationButton.bind(this));
        document.getElementById('js-thumbnail_gallery').addEventListener('click', this.toggleThumbnailGallery.bind(this));
        document.getElementById('js-before-after').addEventListener('click', this.handleBeforeAfterButton.bind(this));
    }

    toggleThumbnailGallery() {
        document.querySelector('.c-slider_navigation-thumbnails').classList.toggle('is-open');
    }

    handleNavigationButtonFullScreen() {
        document.querySelector('.l-main_page').classList.remove('h-noanim');
        document.querySelector('.l-main_navigation').classList.remove('h-noanim');

        document.querySelector('.l-main_page').classList.remove('is-open');
        document.querySelector('.js-navigation_button-full').classList.remove('is-open');
        document.querySelector('.l-main_navigation').classList.remove('is-open');
        this.setState({ isNavOpen: false });
    }

    handleHeaderNavigationButton() {
        const { loadedPart } = this.model.state;

        if (loadedPart !== 5) {
            document.querySelector('.l-main_page').classList.add('is-open');
            setTimeout(() => document.querySelector('.l-main_page').classList.add('h-noanim'), 300);

            setTimeout(() => document.querySelector('.l-main_navigation').classList.add('is-open'), 500);
            setTimeout(() => document.querySelector('.l-main_navigation').classList.add('h-noanim'), 1500);
            this.setState({ isNavOpen: true });
        }
        else {
            this.controller.fetchImages(1);
            this.setState({ isLoadingNewPart: true });
            document.querySelector('.c-mainpage_preloader').classList.add('is-open');
            //document.getElementById('js-header-part').textContent = "";
            document.querySelectorAll('.c-header_navigation li a')[1].innerHTML = '<span class="material-icons js-navigation_button">photo_library</span>';
            document.querySelector('.c-slider_navigation-overlay').classList.add('is-open');
        }
    }

    handleBeforeAfterButton() {
        //this.controller.ajax.get(url).then(data => console.log(data));
        this.controller.fetchImages(5);
        this.setState({ isLoadingNewPart: true });
        document.querySelector('.c-mainpage_preloader').classList.add('is-open');
        document.getElementById('js-header-part').textContent = "";
        document.querySelectorAll('.c-header_navigation li a')[1].innerHTML = 'Go Back <span class="material-icons">arrow_forward</span>';
    }

    setFooter() {
        //TODO
        //document.querySelector('')
    }

    render() {
        // const self = this;
        //console.log(this.model.state);
        // if (document.querySelector('.main_page').classList.contains('is-open')) 
        if (this.model.state.isNavOpen) document.querySelector('.js-navigation_button-full').classList.add('is-open'); // if (!this.model.state.isLoading) this.preloader.classList.remove('is-open');
        //if (this.model.state.images) console.log('imgs arrived!');
    }
}