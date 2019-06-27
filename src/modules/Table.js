import Server from './Server'
import EventEmitter from './EventEmitter'

const server = new Server();

/**
 * Класс, описывающий таблицу с потребителями
 */
export default class Table {
    /**
     * Создание таблицы
     * 
     * @param {array} items   список потребителей
     * @param {UserForm} userForm   класс с формой текущего потребителя
     */
    constructor({ items, userForm }) {
        this.items = items;
        this.userForm = userForm;
        // Объект с названиями и типами колонок таблицы
        this.names = [
            { name: 'Имя', type: 'text', value: 'name' },
            { name: 'Тип', type: 'text', value: 'type' }, 
            { name: 'Номер потребителя', type: 'text', value: 'number' }, 
            { name: '', type: 'edit' }, 
            { name: '', type: 'delete' }
        ];
        // id элемента DOM дерева с таблицей
        this.id = 'usersTable';
        // Элемент DOM дерева для таблицы
        this.content = null;
        // Элемент DOM дерева для тела таблицы
        this.tBody = null;
        // Эмиттер событий 
        this.observer = new EventEmitter();
        // Создание таблицы в DOM дереве
        this.render();
    }

    /**
     * Отрисовка таблицы 
     */
    render() {
        this.content = document.getElementById(this.id);
        this.tBody = document.createElement('tbody');
        this._createTableHeader();
        this._createTableContent();
        this.content.appendChild(this.tBody);
    }

    /**
     * Отрисовка заголовка таблицы 
     */
    _createTableHeader() {
        let tr = document.createElement('tr');
        for (let i = 0; i < this.names.length; i++) {
           let th = document.createElement('th');
           th.innerHTML = this.names[i].name;
           tr.appendChild(th);
        }
        this.tBody.appendChild(tr);
    }

    /**
     * Отрисовка содержимого в ячейке таблицы
     * 
     * @param {object} item   текущий потребитель
     * @param {HTMLElement} td   ячейка таблицы
     * @param {string|number} value   поле потребителя, которое нужно отображать
     */
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

    /**
     * Отрисовка кнопки редактирования потребителя
     * 
     * @param {object} item   текущий потребитель
     * @param {HTMLElement} button   кнопка редактирования потребителя
     * @param {HTMLElement} td   ячейка таблицы
     */
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

    /**
     * Отрисовка кнопки удаления потребителя
     * 
     * @param {number} id   id конкретного потребителя
     * @param {HTMLElement} button   кнопка редактирования потребителя
     * @param {HTMLElement} td   ячейка таблицы
     */
    _renderDeleteButtonTable({ id, button, td }) {
        td.className = 'user__btn-col';
        button.innerHTML = 'Удалить';
        button.className = 'user__btn user__delete';
        button.addEventListener('click', () => {
            this._deleteElement({ id });
        });
        td.appendChild(button);
    }

    /**
     * Отрисовка строки таблицы
     * 
     * @param {object} item   текущий потребитель
     */
    _createTableRow({ item }) {
        let tr = document.createElement('tr');
        for (let j = 0; j < this.names.length; j++) {
            let td = document.createElement('td'); 
            let type = this.names[j].type;
            let button = document.createElement('button');
            let id = item.id;

            // Разделение отрисовки ячейки таблицы по их типам
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

    /**
     * Отрисовка тела таблицы
     */
    _createTableContent() {
        for(let i = 0; i < this.items.length; i++) this.tBody.appendChild(this._createTableRow({ item: this.items[i] }));
    }

    /**
     * Добавление потребителя в список потребителей и его отрисовка в таблице
     * 
     * @param {object} item   текущий потребитель
     */
    addElement(item) {
        this.items.push(item);
        this.tBody.appendChild(this._createTableRow({ item }));
    }

    /**
     * Изменение потребителя в список потребителей и его отрисовка в таблице
     * 
     * @param {object} user   текущий потребитель
     */
    editElement(user) {
        // Получение индекса потребителя user из списка всех потребителей по id
        let index = this.items.map(item => item.id).indexOf(user.id);
        // При нахождении такового, его замена на текущего потребителя
        if(index > -1) this.items[index] = user;
        // Обновление строки таблицы с текущим потребителем
        if(this.tBody.children[index + 1] && index > -1) {
            let newTr = this._createTableRow({ item: user });
            this.tBody.replaceChild(newTr, this.tBody.children[index + 1]);
        }
    }

    /**
     * Удаление потребителя 
     * 
     * @param {number} id   id текущего потребителя
     */
    async _deleteElement({ id }) {
        let res = await server.deleteUser(id);
        if(res.result) {
            // Получение индекса потребителя user из списка всех потребителей по id
            let index = this.items.map(item => item.id).indexOf(id);
            this.items = this.items.filter(item => item.id !== id);
            // Удаление строки таблицы с текущим потребителем
            if(this.tBody.children[index + 1] && index > -1) this.tBody.removeChild(this.tBody.children[index + 1]);
        }
    }
}