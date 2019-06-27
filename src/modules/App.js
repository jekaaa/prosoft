import Server from './Server'
import Table from './Table'
import UserForm from './UserForm'

const server = new Server();

/**
 * Класс, описывающий точку входа в приложение, где объявляются все сущности
 */
export default class App {
    /**
     * Инициализация формы для манипуляции с потребителем и таблицы для их отображения
     */
    async init() {
        let res = await server.getUsers();
        if(res.result) {
            // Объявление массива потребителей
            let items = res.result;
            let userForm = new UserForm();
            let table = new Table({ items, userForm });
            // Подписка на событие сохранения данных в форме 
            userForm.observer.subscribe('save', async user => {
                res = await server.addUser(user);
                if(res.result) table.addElement({ ...user, id: res.result, type: userForm.type });
            });
            // Подписка на событие редактирования данных в форме
            userForm.observer.subscribe('edit', async user => {
                res = await server.editUser(user);
                if(res.result) table.editElement(user);
            });
            // Подписка на нажатие кнопки изменить в строке таблицы
            table.observer.subscribe('edit', user => {
                userForm.set(user);
            });
        }
    }

    /**
     * Запуск приложения после того, как прогрузится DOM дерево
     */
    start() {
        document.addEventListener('DOMContentLoaded', this.init);
    }

}