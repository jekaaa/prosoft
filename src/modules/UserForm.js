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
        this.observer = new EventEmitter();
        this.btn = null;
        this.openBtn = null;
        this.select = null;
        this.render();
    }

    render() {
        this.content = document.getElementById(this.contentId);
        this._initOpenButton();
        this._initCloseButton();
        this._createInput({ 
            content: 'nameInput', 
            field: 'name', 
            name: 'Имя', 
            type: 'text', 
            valid: function() {
                return this.content.value.length > 0 && this.content.value.length < 256;
            }
        });
        this._createInput({ 
            content: 'numberInput', 
            field: 'number', 
            name: 'Номер', 
            type: 'number',
            valid: function() {
                return this.content.value.length == 13 && +this.content.value.length;
            }
        });
        this._createSelect({ name: 'Тип' });
        this._createSaveButton();
    }

    _createInput({ content, field, name, type, valid }) {
        this[content] = new Input({ parent: this.content, name, type, valid });
        this[content].observer.subscribe('change', text => { this[field] = text; });
        this[content].observer.subscribe('noValid', () => {
            this[content].content.style.border = '1px solid red';
        });
    }

    _createSelect({ name }) {
        let options = [
            {
                value: 1,
                text: 'Физическое лицо'
            },
            {
                value: 2,
                text: 'Юридическое лицо'
            }
        ];
        let label = document.createElement('label');
        label.innerHTML = name;
        this.select = document.createElement('select');
        for(let option of options) {
            let o = document.createElement('option');
            o.value = option.value;
            o.text = option.text;
            this.select.appendChild(o);
        }
        let self = this;
        this.select.addEventListener('change', function() {
            self.type = this[this.selectedIndex].value;
        });
        this.content.appendChild(label);
        this.content.appendChild(this.select);
    }

    _createSaveButton() {
        this.btn = document.createElement('button');
        this._updateSaveButton();
        this.btn.className = 'user__save user__btn';
        this.btn.addEventListener('click', () => {
            let { id, name, type, number } = this;
            if(this.nameInput.valid() && this.numberInput.valid()) {
                if(this.id) this.observer.emit('edit', { id, name, type, number });
                else this.observer.emit('save', { id, name, type, number });
            }
            else {
                if(!this.nameInput.valid()) {
                    this.nameInput.observer.emit('noValid');
                }
                if(!this.numberInput.valid()) {
                    this.numberInput.observer.emit('noValid');
                }
            }
        });
        this.content.appendChild(this.btn);
    }

    _initOpenButton() {
        this.openBtn = document.getElementById('openUser');
        this.openBtn.addEventListener('click', () => {
            this.nameInput.content.style.border = 'solid 1px #d7d8db';
            this.numberInput.content.style.border = 'solid 1px #d7d8db';
            this.content.parentElement.style.display = 'flex';
            this.type = this.select.options[this.select.selectedIndex].value;
            this._clearForm();
        });
    }

    _initCloseButton() {
        this.content.parentElement.addEventListener('click', e => {
            if(e.target.className == 'user__form-container') this.content.parentElement.style.display = 'none';
        });
    }

    _updateSaveButton() {
        this.btn.innerText = this.id ? 'Сохранить' : 'Добавить';
    }

    _updateForm() {
        this.nameInput.set(this.name);
        this.numberInput.set(this.number);
        this._updateSaveButton();
    }

    _clearForm() {
        this.id = null;
        this.name = null;
        this.type = null;
        this.number = null;
        this._updateForm();
    }

    set(params) {
        for(let param in params) this[param] = params[param];
        this._updateForm();
    }

}