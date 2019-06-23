import EventEmitter from "./EventEmitter"

export default class Input {
    constructor({ parent, name, type, valid }) {
        this.valid = valid;
        this.parent = parent;
        this.type = type;
        this.content = null;
        this.name = name;
        this.observer = new EventEmitter();
        this.render();
    }
    
    render() {
        let label = document.createElement('label');
        label.innerHTML = this.name;
        this.content = document.createElement('input');
        this.content.type = this.type;
        this.content.addEventListener('input', () => {
            this.observer.emit('change', this.content.value);
        });
        this.parent.appendChild(label);
        this.parent.appendChild(this.content);
    }

    set(value) {
        this.content.value = value;
    }
}