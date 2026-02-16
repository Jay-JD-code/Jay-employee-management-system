const authService = require('../services/authService');

class authController {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;
            await authService.registerUser(name, email, password);
            res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
  async login(req, res) {
        try {
            const { email, password } = req.body;
            const token = await authService.login(email, password);
            res.status(200).json({
                message: 'Login successful',
                token: token
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new authController();