import Input from "./Input"
import EventEmitter from "./EventEmitter"

/**
 * Класс, описывающий форму добавления и редактирования потребителя
 */
export default class UserForm {
    /**
     * Создание формы
     */
    constructor() {
        // id текущего потребителя
        this.id = null;
        // Имя текущего потребителя
        this.name = null;
        // Элемент DOM дерева для поля ввода имени текущего потребителя
        this.nameInput = null;
        // Тип текущего потребителя
        this.type = null;
        // Номер текущего потребителя
        this.number = null;
        // Элемент DOM дерева для поля ввода номера текущего потребителя
        this.numberInput = null;
        // Элемент DOM дерева для формы
        this.content = null;
        // id элемента DOM дерева с формой
        this.contentId = 'userForm';
        // Эмиттер событий
        this.observer = new EventEmitter();
        // Элемент DOM дерева для кнопки
        this.btn = null;
        // Элемент DOM дерева для кнопки открытия
        this.openBtn = null;
        // Элемент DOM дерева для выпадающего списка
        this.select = null;
        // Создание формы в DOM дереве
        this.render();
    }

    /**
     * Отрисовка формы 
     */
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

    /**
     * Добавление и отрисовка поля ввода в форму
     * 
     * @param {string} content   название поля класса для присваивания ему DOM элемента
     * @param {string} field   название поля класса для присваивания ему значения из поля ввода
     * @param {string} name   название заголовка поля ввода
     * @param {string} type   название типа поля ввода
     * @param {function} valid   функция, проверяющая корректность значения поля ввода
     */
    _createInput({ content, field, name, type, valid }) {
        this[content] = new Input({ parent: this.content, name, type, valid });
        this[content].observer.subscribe('change', text => { this[field] = text; });
        this[content].observer.subscribe('noValid', () => {
            this[content].content.style.border = '1px solid red';
        });
    }

    /**
     * Добавление и отрисовка выпадающего списка в форму
     * 
     * @param {string} name    название заголовка выпадающего списка
     */
    _createSelect({ name }) {
        // Список названий типов потребителей
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
        // Изменение типа текущего потребителя на выбор в выпадающем списке
        this.select.addEventListener('change', function() {
            self.type = this[this.selectedIndex].value;
        });
        this.content.appendChild(label);
        this.content.appendChild(this.select);
    }

    /**
     * Добавление и отрисовка кнопки сохранения потребителя
     */
    _createSaveButton() {
        this.btn = document.createElement('button');
        this._updateSaveButton();
        this.btn.className = 'user__save user__btn';
        this.btn.addEventListener('click', () => {
            // Присвоение всех данных текущего потребителя из формы
            let { id, name, type, number } = this;
            // Проверка на корректность всех полей ввода
            if(this.nameInput.valid() && this.numberInput.valid()) {
                if(this.id) this.observer.emit('edit', { id, name, type, number });
                else this.observer.emit('save', { id, name, type, number });
            }
            else {
                // Подсвечивание поля ввода красным цветом при некорректном значении
                this._validInput({ name: 'nameInput' });
                this._validInput({ name: 'numberInput' });
            }
        });
        this.content.appendChild(this.btn);
    }

    /**
     * Проверка поля ввода на корректно введенное значение
     * 
     * @param {string} name   название поля класса, отвечающего за DOM элемент для поля ввода
     */
    _validInput({ name }) {
        if(!this[name].valid()) this[name].observer.emit('noValid');
    }

    /**
     * Отрисовка кнопки открытия формы
     */
    _initOpenButton() {
        this.openBtn = document.getElementById('openUser');
        this.openBtn.addEventListener('click', () => {
            // При открытии обнуляет стиль границы полей ввода 
            this.nameInput.content.style.border = 'solid 1px #d7d8db';
            this.numberInput.content.style.border = 'solid 1px #d7d8db';
            // Показывает форму
            this.content.parentElement.style.display = 'flex';
            // Присвоение типа потребителя при открытии формы
            this.type = this.select.options[this.select.selectedIndex].value;
            // Очищение предыдущих значений
            this._clearForm();
        });
    }

    /**
     * Описывание поведения закрытия формы
     */
    _initCloseButton() {
        this.content.parentElement.addEventListener('click', e => {
            // При клике мимо формы происходит ее закрытие
            if(e.target.className == 'user__form-container') this.content.parentElement.style.display = 'none';
        });
    }

    /**
     * Обновление текста на кнопке
     */
    _updateSaveButton() {
        this.btn.innerText = this.id ? 'Сохранить' : 'Добавить';
    }

    /**
     * Обновление всех значений формы
     */
    _updateForm() {
        this.nameInput.set(this.name);
        this.numberInput.set(this.number);
        this._updateSaveButton();
    }

    /**
     * Очищение всех полей формы
     */
    _clearForm() {
        this.id = null;
        this.name = null;
        this.number = null;
        this._updateForm();
    }

    /**
     * Присвоение значений всем входящим полям класса
     * 
     * @param {object} params   объект со значениями полей класса
     */
    set(params) {
        for(let param in params) this[param] = params[param];
        this._updateForm();
    }

}