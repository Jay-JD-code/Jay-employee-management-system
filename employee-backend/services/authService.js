const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');
const jwt = require('jsonwebtoken');


class authService {
    async registerUser(name, email, password) {
        const existingUser = await userRepository.getUserByEmail(email);
        if(existingUser && existingUser.length > 0) {
            throw new Error('User already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        return await userRepository.createUser(name, email, hashedPassword);
    }   

  async login(email, password) {

    // Hardcoded Admin
    if (email === "admin@gmail.com" && password === "admin") {

       const token = jwt.sign(
    { id: "admin", email: email, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
);


        return token;
    }

    const users = await userRepository.getUserByEmail(email);

    if (!users || users.length === 0) {
        throw new Error("User not found");
    }

    const user = users[0];   // 🔥 FIX HERE

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, role: "user" },   // 🔥 MySQL uses id not _id
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return token;
}


    }

module.exports = new authService();