const express = require('express');
const cors = require('cors');


require('./config/db'); // Import the database connection
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:8080",
    credentials: true
}));

app.use(express.json());




// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const employeeRoutes = require('./routes/employeeRoutes');
app.use('/api/employees', employeeRoutes);


app.use("/api/users", require("./routes/userRoutes"));




app.get('/', (req, res) => {
  res.send('Employee Backend is running');
});

const PORT = process.env.DB_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});