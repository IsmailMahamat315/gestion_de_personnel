const Employee = require('../models/employee');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, surname, email, password, role, department } = req.body;

        const existing = await Employee.findOne({ email });
        if (existing) return res.status(409).json({ message: 'Email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const employee = new Employee({
            name,
            surname,
            email,
            password: hashedPassword,
            role,
            department
        });

        await employee.save();
        return res.status(201).json({ message: 'User registered successfully' });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const employee = await Employee.findOne({ email });
        if (!employee) return res.status(400).json({ message: 'Invalid email or password' });

        const validPassword = await bcrypt.compare(password, employee.password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid email or password' });

        const token = jwt.sign({ id: employee._id, role: employee.role }, 'YOUR_SECRET_KEY', { expiresIn: '1h' });

        return res.json({ token, role: employee.role });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};