const db = require('./dbConfig');

module.exports = {
    addUser,
    find,
    findBy,
    remove
}

function addUser(newUser) {
    return db('users').insert(newUser, 'id')
        .then(id => {
            [id] = id;
            return findBy({id});
        })
}

function find() {
    return db('users').select('id', 'username', 'department');
}

function findBy(filter) {
    return db('users').select('id', 'username', 'department', 'password').where(filter);
}

function remove(id) {
    return db('users').del().where({id});
}