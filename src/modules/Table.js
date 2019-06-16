import Server from './Server'
import EventEmitter from './EventEmitter'

const server = new Server();

export default class Table {
    constructor({ items }) {
        this.items = items;
        this.names = [
            { name: 'Имя', type: 'text', value: 'name' },
            { name: 'Тип', type: 'text', value: 'type' }, 
            { name: 'Номер потребителя', type: 'text', value: 'number' }, 
            { name: '', type: 'edit' }, 
            { name: '', type: 'delete' }
        ];
        this.id = 'usersTable';
        this.content = null;
        this.observer = new EventEmitter();
        this.render();
    }

    render() {
        this.content = document.getElementById(this.id);
        let tBody = document.createElement('tbody');
        this._createTableHeader(tBody);
        this._createTableContent(tBody);
        this.content.appendChild(tBody);
    }

    _createTableHeader(tBody) {
        let tr = document.createElement('tr');
        for (let i = 0; i < this.names.length; i++) {
           let th = document.createElement('th');
           th.innerHTML = this.names[i].name;
           tr.appendChild(th);
        }
        tBody.appendChild(tr);
    }

    _createTableRow({ item, tBody }) {
        let tr = document.createElement('tr');
        for (let j = 0; j < this.names.length; j++) {
            let td = document.createElement('td'); 
            let type = this.names[j].type;
            let button = document.createElement('button');
            let id = item.id;

            switch(type) {
                case 'text':
                    td.innerHTML = item[this.names[j].value];
                    break;
                case 'edit':
                    button.addEventListener('click', () => {
                        this.observer.emit('edit', item);
                    });
                    td.appendChild(button);
                    break;
                case 'delete':
                    button.addEventListener('click', () => {
                        this._deleteElement({ id, tBody });
                    });
                    td.appendChild(button);
                    break;
                default:
                    break;
            }
            tr.appendChild(td);
        }
        return tr;
    }

    _createTableContent(tBody) {
        for(let i = 0; i < this.items.length; i++) tBody.appendChild(this._createTableRow({ item: this.items[i], tBody }));
    }

    addElement(item) {
        this.items.push(item);
        let tBody = this.content.children[0];
        tBody.appendChild(this._createTableRow({ item, tBody }));
    }

    editElement(user) {
        let index = this.items.map(item => item.id).indexOf(user.id);
        if(index > -1) this.items[index] = user;
        let tBody = this.content.children[0];
        if(tBody.children[index + 1] && index > -1) tBody.replaceChild(this._createTableRow({ item: user, tBody }), tBody.children[index + 1]);
    }

    _deleteElement({ id, tBody }) {
        let res = server.deleteUser(id);
        if(res.result) {
            let index = this.items.map(item => item.id).indexOf(id);
            this.items = this.items.filter(item => item.id !== id);
            if(tBody.children[index + 1] && index > -1) tBody.removeChild(tBody.children[index + 1]);
        }
    }
}