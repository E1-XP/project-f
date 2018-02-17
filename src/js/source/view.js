export default class View {
    constructor(model, controller) {
        this.model = model;
        this.controller = controller;

        this.attachHandlers();
        this.render();
        //this.setState = this.model.setState.bind(this);
        Object.keys(this.model.state).forEach(key => this.model.observe(key, this));
    }

    attachHandlers() {
    }

    render() {
    }
}