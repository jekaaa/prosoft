import Server from './modules/Server'
import Table from './modules/Table'
import UserForm from './modules/UserForm'

const server = new Server();

document.addEventListener('DOMContentLoaded', () => {
    let res = server.getUsers();
    if(res.result) {
        let items = res.result;
        let table = new Table({ items });
        let userForm = new UserForm();
        userForm.observer.subscribe('save', user => {
            res = server.addUser(user);
            if(res.result) table.addElement({ ...user, id: res.result });
        });
        table.observer.subscribe('edit', user => {
            res = server.editUser(user);
            if(res.result) table.editElement({ ...user, id: res.result });
        });
    }
    else console.log('Get users error ->', res.error);
});
