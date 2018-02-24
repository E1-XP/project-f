import DOM from '../helpers/dom';

export default class View {
    constructor(model, controller) {
        this.model = model;
        this.controller = controller;
        this.DOM = DOM;

        this.setState = function (obj) {
            const self = this;
            this.model.setState(obj, self);
        }

        this.attachHandlers();
        this.render();

        Object.keys(this.model.state).forEach(key => this.model.observe(key, this));
    }

    attachHandlers() {
    }

    render() {
    }
}