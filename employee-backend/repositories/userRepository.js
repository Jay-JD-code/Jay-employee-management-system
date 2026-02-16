const db = require('../config/db');

class userRepository {

    createUser(name, email, hashedPassword) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
            db.query(query, [name, email, hashedPassword], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);           
            });
        });
    }

    getUserByEmail(email) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE email = ?';
            db.query(query, [email], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    findUserById(id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT id, name, email FROM users WHERE id = ?";
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result[0]);
        });
    });
}

updateUser(id, name, email) {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE users SET name=?, email=? WHERE id=?";
        db.query(sql, [name, email, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

}

module.exports = new userRepository();