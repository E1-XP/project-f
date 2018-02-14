import View from '../source/view';

export default class MainPage extends View {
    constructor(model) {
        super(model);
        this.DOM = {};
        //this.DOM.mainPage = 
    }
    attachHandlers() {
        document.querySelector('.navigation_button-full').addEventListener('click', () => {
            document.querySelector('.main_page').classList.remove('is-open');
            document.querySelector('.navigation_button-full').classList.remove('is-open');
            document.querySelector('.main_navigation').classList.remove('is-open');
            this.model.setState({ isNavOpen: false });
        });

        document.querySelector('.navigation_button').addEventListener('click', () => {
            document.querySelector('.main_page').classList.add('is-open');
            setTimeout(() => document.querySelector('.main_navigation').classList.add('is-open'), 500);
            this.model.setState({ isNavOpen: true });
            console.log('test state');
        });
    }

    render() {
        // const self = this;
        //console.log(this.model.state);
        //console.log(this.DOM);
        // if (document.querySelector('.main_page').classList.contains('is-open')) 
        if (this.model.state.isNavOpen) document.querySelector('.navigation_button-full').classList.add('is-open');
        // if (!this.model.state.isLoading) this.preloader.classList.remove('is-open');
    }
}
