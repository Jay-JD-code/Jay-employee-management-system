const employeeRepository = require('../repositories/employeeRepository');

class employeeService {
    
   async addEmployee(name, department, salary, id, role) {

    if (role === "user") {

        const existing = await employeeRepository.findEmployeeByUserId(id);

        if (existing) {
            throw new Error("You already have an employee profile.");
        }
    }

    return await employeeRepository.createEmployee(name, department, salary, id);
}


    async getAllEmployees() {
        return await employeeRepository.getAllEmployees();
    }
    
    async updateEmployee(id, name, department, salary) {
        return await employeeRepository.updateEmployee(id, name, department, salary);
    }

    async deleteEmployee(id) {
        return await employeeRepository.deleteEmployee(id);
    }
}

module.exports = new employeeService();