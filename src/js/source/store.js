import EventEmitter from './dispatcher';

export default class Store extends EventEmitter {
    constructor(stateCandidate) {
        super();

        this.state = {}

        this.registerInitialState(stateCandidate);
    }

    setState(obj, caller) {
        const prevState = this.state;

        Object.keys(obj).forEach(key => {
            console.log(typeof obj.currentPart)
            switch (typeof prevState[key]) {
                case 'number': Number(obj[key]); break;
                case 'string': String(obj[key]); break;
                case 'boolean': Boolean(obj[key]); break;
            }
        });

        this.state = Object.assign({}, prevState, obj);

        for (let key in obj) {
            if (prevState[key] !== undefined && (prevState[key] !== obj[key])) {
                console.log('changes/new value ' + key + ': ' + obj[key]);
                this.emit(key);
            }
        }
        console.log('called setState ', this.state);
    }

    registerInitialState(stateCandidate) {
        const self = this;

        for (let key in stateCandidate) {

            Object.defineProperty(this.state, key, {
                get() {
                    //console.log('called getter!! ');

                    //console.log('where i am? ', self);
                    //console.log('you called me: ', this.caller)
                    //self.observe.call(this, key, this);
                    return stateCandidate[key];
                },
                enumerable: true
            });

            this.topics[key] = [];
        }

        console.log('compiled state: ', this.getState());
        Object.freeze(this.state);
    }

    getState() {
        return this.state;
    }
}
