import User from './modules/User'
import Server from './modules/Server'
import Table from './modules/Table'

let user = new User();
let server = new Server();

document.addEventListener('DOMContentLoaded', () => {
    let res = server.getUsers();
    if(res.result) {
        console.log(users);
    }
    else console.log('Get users error ->', res.error);
});
