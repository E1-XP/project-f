import View from '../source/view';

export default class Preloader extends View {
    constructor(model, controller) {
        super(model, controller);

        this.preloader = document.querySelector('.c-main_preloader');
    }

    render() {
        console.log(this.model.state);
        if (!this.model.state.isLoading) setTimeout(() => this.preloader.classList.remove('is-open'), 1500);
    }
}
