export default class EventEmitter {
    constructor() {
        if (new.target === EventEmitter) throw new TypeError(`Can't construct an instance of abstract class`);

        this.topics = {}
    }

    observe(topic, ref) {
        if (!this.topics[topic]) this.topic[topic] = [];
        if (!ref.render || typeof ref.render !== 'function') throw new Error('Incorrect interface, ensure render is a function.')
        if (this.topics[topic].indexOf(ref) === -1) {
            console.log('new ref: ', ref, topic);
            this.topics[topic].push(ref);
        }
        //console.log(this.topics);
        //console.log('called fn observe');
    }

    removeObserver(topic, ref) {
        const idx = this.topics.indexOf(ref);
        if (idx !== -1) this.topics.splice(idx, 1);
        else throw new Error('removeObserver:ref not found.');
    }

    emit(topic) {
        if (!this.topics[topic]) return 0;
        console.log('topics: ', this.getTopics());
        this.topics[topic].forEach(observer => observer.render());
        console.log('called emit!');
    }

    getTopics() {
        return this.topics;
    }
}