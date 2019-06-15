import Server from './Server'

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
    }

    render() {
        this.content = document.getElementById(this.id);
        let tBody = document.createElement('tbody');
        this._createTableHeader(tBody);
        this._createTableContent(tBody);
    }

    _createTableHeader(tBody) {
        let tr = document.createElement('tr');
        for (let i = 0; i < this.names.length; i++) {
           let th = document.createElement('th');
           th.innerHTML = this.names[i].name;
           tr.appendChild(th);
        }
        tBody.appendChild(tr);
        this.content.appendChild(tBody);
    }

    _createTableContent(tBody) {
        for(let i = 0; i < this.items.length; i++) {
            let tr = document.createElement('tr');
            for (let j = 0; j < this.names.length; j++) {
                let td = document.createElement('td'); 
                let type = this.names[j].type;
                let button = document.createElement('button');
                let id = this.items[i].id;

                switch(type) {
                    case 'text':
                        td.innerHTML = this.items[i][this.names[j].value];
                        break;
                    case 'edit':
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
            tBody.appendChild(tr);
        }
        this.content.appendChild(tBody);
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