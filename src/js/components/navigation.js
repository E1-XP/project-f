import View from '../source/view';

export default class Navigation extends View {
    constructor(model, controller) {
        super(model, controller);

        //  this.preloader = document.querySelector('.c-main_preloader');

    }
    attachHandlers() {
        Array.from(document.querySelectorAll('.c-navigation_item')).forEach(item => {
            item.addEventListener('click', this.handleMainNavigationClick.bind(this))
        });
    }

    handleMainNavigationClick(e) {
        document.querySelector('.l-main_page').classList.remove('is-open');
        document.querySelector('.js-navigation_button-full').classList.remove('is-open');
        document.querySelector('.l-main_navigation').classList.remove('is-open');
        this.model.setState({ isNavOpen: false });

        this.controller.init(e.target.dataset.key);
    }

    render() {
        // console.log(this.model.state);

        // if (!this.model.state.isLoading) this.preloader.classList.remove('is-open');
    }
}
