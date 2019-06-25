import Server from './Server'
import EventEmitter from './EventEmitter'

const server = new Server();

export default class Table {
    constructor({ items, userForm }) {
        this.items = items;
        this.userForm = userForm;
        this.names = [
            { name: 'Имя', type: 'text', value: 'name' },
            { name: 'Тип', type: 'text', value: 'type' }, 
            { name: 'Номер потребителя', type: 'text', value: 'number' }, 
            { name: '', type: 'edit' }, 
            { name: '', type: 'delete' }
        ];
        this.id = 'usersTable';
        this.content = null;
        this.tBody = null;
        this.observer = new EventEmitter();
        this.render();
    }

    render() {
        this.content = document.getElementById(this.id);
        this.tBody = document.createElement('tbody');
        this._createTableHeader();
        this._createTableContent();
        this.content.appendChild(this.tBody);
    }

    _createTableHeader() {
        let tr = document.createElement('tr');
        for (let i = 0; i < this.names.length; i++) {
           let th = document.createElement('th');
           th.innerHTML = this.names[i].name;
           tr.appendChild(th);
        }
        this.tBody.appendChild(tr);
    }

    _renderTextTable({ item, td, value }) {
        let types = [
            {},
            {
                name: 'Ф',
                fullName: 'Физическое лицо'
            },
            {
                name: 'Ю',
                fullName: 'Юридическое лицо'
            }
        ];
        if(value == 'type') {
            td.innerHTML = types[item[value]].name;
            td.title = types[item[value]].fullName;
        }
        else td.innerHTML = item[value];
    }

    _renderEditButtonTable({ item, button, td }) {
        td.className = 'user__btn-col';
        button.innerHTML = 'Изменить';
        button.className = 'user__btn user__edit';
        button.addEventListener('click', () => {
            this.observer.emit('edit', item);
            this.userForm.content.parentElement.style.display = 'flex';
            this.userForm.nameInput.content.style.border = 'solid 1px #d7d8db';
            this.userForm.numberInput.content.style.border = 'solid 1px #d7d8db';
            this.userForm.type = item.type;
            this.userForm.select.value = item.type;
        });
        td.appendChild(button);
    }

    _renderDeleteButtonTable({ id, button, td }) {
        td.className = 'user__btn-col';
        button.innerHTML = 'Удалить';
        button.className = 'user__btn user__delete';
        button.addEventListener('click', () => {
            this._deleteElement({ id });
        });
        td.appendChild(button);
    }

    _createTableRow({ item }) {
        let tr = document.createElement('tr');
        for (let j = 0; j < this.names.length; j++) {
            let td = document.createElement('td'); 
            let type = this.names[j].type;
            let button = document.createElement('button');
            let id = item.id;

            switch(type) {
                case 'text':
                    this._renderTextTable({ item, td, value: this.names[j].value });
                    break;
                case 'edit':
                    this._renderEditButtonTable({ item, button, td });
                    break;
                case 'delete':
                    this._renderDeleteButtonTable({ id, button, td });
                    break;
                default:
                    break;
            }
            tr.appendChild(td);
        }
        return tr;
    }

    _createTableContent() {
        for(let i = 0; i < this.items.length; i++) this.tBody.appendChild(this._createTableRow({ item: this.items[i] }));
    }

    addElement(item) {
        this.items.push(item);
        this.tBody.appendChild(this._createTableRow({ item }));
    }

    editElement(user) {
        let index = this.items.map(item => item.id).indexOf(user.id);
        if(index > -1) this.items[index] = user;
        
        if(this.tBody.children[index + 1] && index > -1) {
            let newTr = this._createTableRow({ item: user });
            this.tBody.replaceChild(newTr, this.tBody.children[index + 1]);
        }
    }

    async _deleteElement({ id }) {
        let res = await server.deleteUser(id);
        if(res.result) {
            let index = this.items.map(item => item.id).indexOf(id);
            this.items = this.items.filter(item => item.id !== id);
            if(this.tBody.children[index + 1] && index > -1) this.tBody.removeChild(this.tBody.children[index + 1]);
        }
    }
}