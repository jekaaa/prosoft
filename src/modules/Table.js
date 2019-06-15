export default class Table {
    constructor({ items }) {
        this.items = items;
        this.id = 'usersTable';
        this.content = null;
    }

    _init() {
        this.content = document.getElementById(this.id);
    }
}