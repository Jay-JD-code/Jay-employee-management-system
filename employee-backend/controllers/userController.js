const userRepository = require("../repositories/userRepository");

class UserController {

    async getProfile(req, res) {
        try {
            const user = await userRepository.findUserById(req.user.id);
            res.json(user);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async updateProfile(req, res) {
        try {
            const { name, email } = req.body;
            await userRepository.updateUser(req.user.id, name, email);

            res.json({ message: "Profile updated" });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}

module.exports = new UserController();
