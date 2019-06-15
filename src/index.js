import User from './modules/User'
import Server from './modules/Server'
import Table from './modules/Table'

const server = new Server();

document.addEventListener('DOMContentLoaded', () => {
    let res = server.getUsers();
    if(res.result) {
        let items = res.result;
        let table = new Table({ items });
        table.render();
    }
    else console.log('Get users error ->', res.error);
});
