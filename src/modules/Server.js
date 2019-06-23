export default class Server {
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
    
    getUsers() {
        let result = JSON.parse(JSON.stringify(this.users));
        result.sort((user1, user2) => user1.name.toLowerCase() >= user2.name.toLowerCase() ? 1 : -1);
        return new Promise(resolve => {
            resolve({ result });
        });
    }

    deleteUser(id) {
        this.users = this.users.filter(user => user.id !== id); 
        return new Promise(resolve => {
            resolve({ result: 'OK' });
        });
    }

    addUser(user) {
        let result = this.users[this.users.length - 1].id + 1;
        this.users.push({ ...user, id: result });
        return new Promise(resolve => {
            resolve({ result });
        });
    }

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