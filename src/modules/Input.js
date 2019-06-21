import EventEmitter from "./EventEmitter"

export default class Input {
    constructor({ parent }) {
        this.parent = parent;
        this.content = null;
        this.observer = new EventEmitter();
        this.render();
    }
    
    render() {
        this.content = document.createElement('input');
        this.content.addEventListener('input', () => {
            this.observer.emit('change', this.content.value);
        });
        this.parent.appendChild(this.content);
    }

    set(value) {
        this.content.value = value;
    }
}