import Input from "./Input"
import EventEmitter from "./EventEmitter"

export default class UserForm {
    constructor() {
        this.id = null;
        this.name = null;
        this.nameInput = null;
        this.type = null;
        this.number = null;
        this.numberInput = null;
        this.content = null;
        this.contentId = 'userForm';
        this.opened = false;
        this.observer = new EventEmitter();
        this.btn = null;
        this.render();
    }

    render() {
        this.content = document.getElementById(this.contentId);
        this._createInput({ content: 'nameInput', name: 'name' });
        this._createInput({ content: 'numberInput', name: 'number' });
        this._createButton();
    }

    _createInput({ content, name }) {
        this[content] = new Input({ parent: this.content });
        this[content].observer.subscribe('change', text => { this[name] = text; });
    }

    _createButton() {
        this.btn = document.createElement('button');
        this._updateButton();
        this.content.appendChild(this.btn);
    }

    _updateButton() {
        this.btn.innerText = this.id ? 'Сохранить' : 'Добавить';
        this.btn.addEventListener('click', () => {
            let { id, name, type, number } = this;
            if(this.id) this.observer.emit('edit', { id, name, type, number });
            else this.observer.emit('save', { id, name, type, number });
        });
    }

    _updateForm() {
        this.nameInput.set(this.name);
        this.numberInput.set(this.number);
        this._updateButton();
    }

    set(params) {
        for(let param in params) this[param] = params[param];
        this._updateForm();
    }

}