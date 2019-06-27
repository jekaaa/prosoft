/**
 * Класс, описывающий API сервера
 */
export default class Server {
    /**
     * Объявление 5 конкретных потребителей
     */
    constructor() {
        this.users = [
            {
                id: 1,
                name: 'Олег',
                type: 1,
                number: '1231231231231'
            },
            {
                id: 2,
                name: 'Оксана',
                type: 2,
                number: '1235631231231'
            },
            {
                id: 3,
                name: 'Александр',
                type: 2,
                number: '1235431231231'
            },
            {
                id: 4,
                name: 'Василий',
                type: 1,
                number: '1236781231231'
            },
            {
                id: 5,
                name: 'Никита',
                type: 1,
                number: '1234461231231'
            }
        ]; 
    }
    
    // 
    /**
     * Получение потребителей
     * 
     * @returns {promise}
     * @resolve {object}
     * @property {array} result   набор всех потребителей, отсортированный в алфавитном порядке по имени
     */
    getUsers() {
        let result = JSON.parse(JSON.stringify(this.users));
        result.sort((user1, user2) => user1.name.toLowerCase() >= user2.name.toLowerCase() ? 1 : -1);
        return new Promise(resolve => {
            resolve({ result });
        });
    }

    /**
     * Удаление потребителя по его id
     * 
     * @param {number} id   id удаляемого потребителя
     * @returns {promise}
     * @resolve {object}
     * @property {'OK'} result   положительный результат ответа 
     */
    deleteUser(id) {
        this.users = this.users.filter(user => user.id !== id); 
        return new Promise(resolve => {
            resolve({ result: 'OK' });
        });
    }

    /**
     * Добавление потребителя
     * 
     * @param {object} user
     * @property {string} name   имя добавляемого потребителя
     * @property {number} number   номер добавляемого потребителя
     * @property {1|2} type   тип добавляемого потребителя, где 1 - физическое лицо, а 2 - юридическое лицо
     * @returns {promise}
     * @resolve {object}
     * @property {number} id   id для нового потребителя  
     */
    addUser(user) {
        let result = this.users[this.users.length - 1].id + 1;
        this.users.push({ ...user, id: result });
        return new Promise(resolve => {
            resolve({ result });
        });
    }

     /**
      * Редактирование потребителя
      * 
      * @param {object} editedUser
      * @property {number} id   id редактируемого потребителя
      * @property {string} name   имя редактируемого потребителя
      * @property {number} number   номер редактируемого потребителя
      * @property {1|2} type   тип редактируемого потребителя, где 1 - физическое лицо, а 2 - юридическое лицо
      * @returns {promise}
      * @resolve {object}
      * @property {'OK'} result   положительный результат ответа 
      */
    editUser(editedUser) {
        for(let i = 0; i < this.users.length; i++) {
            if(this.users[i].id === editedUser.id) {
                this.users[i] = editedUser;
                break;
            }
        }
        return new Promise(resolve => {
            resolve({ result: 'OK' });
        });
    }
}