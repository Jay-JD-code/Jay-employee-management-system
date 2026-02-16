const employeeService = require('../services/employeeService');
const employeeRepository = require('../repositories/employeeRepository');

class employeeController {

    async addEmployee(req, res) {
    try {
        const { name, department, salary } = req.body;

        await employeeService.addEmployee(
            name,
            department,
            salary,
            req.user.id,
            req.user.role
        );

        res.status(201).json({ message: "Employee profile saved" });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


async getAllEmployees(req, res) {
    try {

        if (req.user.role === "admin") {
            const employees = await employeeRepository.getAllEmployees();
            return res.json(employees);
        }

        // Normal user
        const emp = await employeeRepository.findEmployeeByUserId(req.user.id);

        if (!emp) {
            return res.json([]); // no employee yet
        }

        return res.json([emp]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



  async updateEmployee(req, res) {
    try {
        const { id } = req.params;
        const { name, department, salary } = req.body;

        if (req.user.role === "user") {
            const emp = await employeeRepository.findEmployeeByUserId(req.user.id);

            if (!emp || emp.id != id) {
                return res.status(403).json({ error: "Access denied" });
            }
        }

        await employeeService.updateEmployee(id, name, department, salary);

        res.json({ message: "Updated successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


    async deleteEmployee(req, res) {
    try {
        const { id } = req.params;

        // 👤 If normal user, verify ownership
        if (req.user.role === "user") {

            const emp = await employeeRepository.findEmployeeByUserId(req.user.id);

            // If no employee found OR trying to delete someone else's
            if (!emp || emp.id != id) {
                return res.status(403).json({
                    error: "Access denied"
                });
            }
        }

        // 👑 Admin or valid owner can delete
        await employeeService.deleteEmployee(id);

        res.json({
            message: "Employee deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}
}

module.exports = new employeeController();
