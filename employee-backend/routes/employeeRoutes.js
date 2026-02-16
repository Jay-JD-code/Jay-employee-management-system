const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const verifyToken = require('../middleware/authMiddleware');

//  Admin can access all employees
router.get("/", verifyToken, (req, res) => {
    employeeController.getAllEmployees(req, res);
});

router.post("/", verifyToken, (req, res) => {
    employeeController.addEmployee(req, res);
});

router.put("/:id", verifyToken, (req, res) => {
    employeeController.updateEmployee(req, res);
});

router.delete("/:id", verifyToken, (req, res) => {
    employeeController.deleteEmployee(req, res);
});



module.exports = router;