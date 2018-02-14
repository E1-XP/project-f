import View from '../source/view';

export default class Preloader extends View {
    constructor(model) {
        super(model);

        this.preloader = document.querySelector('.c-main_preloader');

    }

    render() {
        console.log(this.model.state);

        if (!this.model.state.isLoading) this.preloader.classList.remove('is-open');
    }
}
