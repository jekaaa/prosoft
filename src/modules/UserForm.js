import Input from "./Input"
import EventEmitter from "./EventEmitter"

export default class UserForm {
    constructor() {
        this.id = null;
        this.name = null;
        this.type = null;
        this.number = null;
        this.content = null;
        this.contentId = 'userForm';
        this.opened = false;
        this.observer = new EventEmitter();
        this.render();
    }

    render() {
        this.content = document.getElementById(this.contentId);
        let nameInput = new Input({ value: this.name, parent: this.content });
        nameInput.observer.subscribe('change', text => { this.name = text; });

        let numberInput = new Input({ value: this.number, parent: this.content });
        numberInput.observer.subscribe('change', text => { this.number = text; });

        let saveBtn = document.createElement('button');
        saveBtn.innerText = this.id ? 'Сохранить' : 'Добавить';
        saveBtn.addEventListener('click', () => {
            let { id, name, type, number } = this;
            this.observer.emit('save', { id, name, type, number });
        });
        this.content.appendChild(saveBtn);
    }

    set(params) {
        for(param in params) this[param] = params[param];
        
    }

}