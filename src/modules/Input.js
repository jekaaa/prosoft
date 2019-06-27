import EventEmitter from "./EventEmitter"

/**
 * Класс, описывающий поле ввода
 */
export default class Input {
    /**
     * Создание поля ввода
     * 
     * @param {HTMLElement} parent   элемент DOM дерева, куда нужно добавить поле ввода
     * @param {string} name   заголовок поля ввода  
     * @param {string} type   тип поля ввода 
     * @param {function} valid   функция, определяющая правильное занчение поля ввода
     */
    constructor({ parent, name, type, valid }) {
        this.valid = valid;
        this.parent = parent;
        this.type = type;
        // Элемент DOM дерева для поля ввода
        this.content = null;
        this.name = name;
        // Эмиттер событий для поля ввода
        this.observer = new EventEmitter();
        // Создание поля ввода в DOM дереве
        this.render();
    }
    
    /**
     * Отрисовка поля ввода 
     */
    render() {
        let label = document.createElement('label');
        label.innerHTML = this.name;
        this.content = document.createElement('input');
        this.content.type = this.type;
        // При любом изменении поля ввода транслируется событие change в эмиттер
        this.content.addEventListener('input', () => {
            if(this.content.style.borderColor == 'red') this.content.style.border = 'solid 1px #d7d8db'; 
            this.observer.emit('change', this.content.value);
        });
        this.parent.appendChild(label);
        this.parent.appendChild(this.content);
    }

    /**
     * Присвоение значения полю ввода
     * 
     * @param {string|number} value    значение поля ввода
     */
    set(value) {
        this.content.value = value;
    }
}