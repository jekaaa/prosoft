import Server from './Server'
import Table from './Table'
import UserForm from './UserForm'

const server = new Server();

export default class App {
    async init() {
        let res = await server.getUsers();
        if(res.result) {
            let items = res.result;
            let userForm = new UserForm();
            let table = new Table({ items, userForm });
            userForm.observer.subscribe('save', async user => {
                res = await server.addUser(user);
                if(res.result) table.addElement({ ...user, id: res.result });
            });
            userForm.observer.subscribe('edit', async user => {
                res = await server.editUser(user);
                if(res.result) table.editElement(user);
            });
            table.observer.subscribe('edit', user => {
                userForm.set(user);
            });
        }
    }

    start() {
        document.addEventListener('DOMContentLoaded', this.init);
    }

}