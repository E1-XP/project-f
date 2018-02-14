import View from '../source/view';

export default class Navigation extends View {
    constructor(model) {
        super(model);

        //  this.preloader = document.querySelector('.c-main_preloader');

    }
    attachHandlers() {
        Array.from(document.querySelectorAll('.navigation_item')).forEach(el => {
            el.addEventListener('click', () => {
                document.querySelector('.main_page').classList.remove('is-open');
                document.querySelector('.navigation_button-full').classList.remove('is-open');
                document.querySelector('.main_navigation').classList.remove('is-open');
                this.model.setState({ isNavOpen: false });
            })
        });
    }
    render() {
        // console.log(this.model.state);

        // if (!this.model.state.isLoading) this.preloader.classList.remove('is-open');
    }
}
