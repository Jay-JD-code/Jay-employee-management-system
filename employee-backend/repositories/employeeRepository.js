const db = require('../config/db');



class employeeRepository {

    createEmployee(name, department, salary) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO employees (name, department, salary) VALUES (?, ?, ?)';
            db.query(sql, [name, department, salary], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    getAllEmployees() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM employees';
            db.query(sql, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    updateEmployee(id, name, department, salary) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE employees SET name = ?, department = ?, salary = ? WHERE id = ?';
            db.query(sql, [name, department, salary, id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    deleteEmployee(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM employees WHERE id = ?';
            db.query(sql, [id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    findEmployeeByUserId(id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM employees WHERE id = ?";
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result[0]);
        });
    });
}

}

module.exports = new employeeRepository();