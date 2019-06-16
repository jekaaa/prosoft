import EventEmitter from "./EventEmitter"

export default class Input {
    constructor({ value, parent }) {
        this.value = value;
        this.parent = parent;
        this.observer = new EventEmitter();
        this.render();
    }
    
    render() {
        let input = document.createElement('input');
        input.addEventListener('input', () => {
            this.observer.emit('change', input.value);
        });
        this.parent.appendChild(input);
    }
}