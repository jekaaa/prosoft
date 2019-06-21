import Server from './modules/Server'
import Table from './modules/Table'
import UserForm from './modules/UserForm'

const server = new Server();

function init() {
    let res = server.getUsers();
    if(res.result) {
        let items = res.result;
        let table = new Table({ items });
        let userForm = new UserForm();
        userForm.observer.subscribe('save', user => {
            res = server.addUser(user);
            if(res.result) table.addElement({ ...user, id: res.result });
        });
        userForm.observer.subscribe('edit', user => {
            res = server.editUser(user);
            if(res.result) table.editElement(user);
        });
        table.observer.subscribe('edit', user => {
            userForm.set(user);
        });
    }
}

function bind() {
    document.addEventListener('DOMContentLoaded', init);
}

bind();
