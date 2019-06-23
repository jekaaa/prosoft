import EventEmitter from "./EventEmitter"

export default class Select {
    constructor({ parent, name, items }) {
        this.parent = parent;
        this.items = items;
        this.content = null;
        this.name = name;
        this.observer = new EventEmitter();
        this.render();
    }
    
    render() {
        let label = document.createElement('label');
        label.innerHTML = this.name;
        this.content = document.createElement('select');
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