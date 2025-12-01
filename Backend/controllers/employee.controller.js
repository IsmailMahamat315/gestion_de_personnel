const Employee = require('../models/employee');
const Department = require('../models/department');
const bcrypt = require('bcryptjs');

exports.create = async (req, res) => {
    try {
        const { name, surname, email, password, role, department } = req.body;
        if (!name || !surname || !email || !password) return res.status(400).json({ message: 'Content cannot be empty!' });

        const exists = await Employee.findOne({ email });
        if (exists) return res.status(409).json({ message: 'Employee already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const employee = new Employee({ name, surname, email, password: hashedPassword, role, department });
        const savedEmployee = await employee.save();

        if (department) await Department.findByIdAndUpdate(department, { $push: { employees: savedEmployee._id } });

        return res.status(201).json({ message: 'Employee created successfully', employee: savedEmployee });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.findAll = async (req, res) => {
    try {
        const employees = await Employee.find().populate('department', 'name');
        return res.json(employees);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.findOne = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id).populate('department', 'name');
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        return res.json(employee);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.update = async (req, res) => {
    try {
        const { name, surname, email, password, role, department } = req.body;
        const { id } = req.params;

        const employee = await Employee.findById(id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        if (email && email !== employee.email) {
            const exists = await Employee.findOne({ email });
            if (exists) return res.status(409).json({ message: 'Email already used by another employee' });
        }

        employee.name = name || employee.name;
        employee.surname = surname || employee.surname;
        employee.email = email || employee.email;
        if (password) employee.password = await bcrypt.hash(password, 10);
        employee.role = role || employee.role;

        const oldDept = employee.department?.toString();
        employee.department = department || employee.department;

        await employee.save();

        if (department && department !== oldDept) {
            if (oldDept) await Department.findByIdAndUpdate(oldDept, { $pull: { employees: id } });
            await Department.findByIdAndUpdate(department, { $push: { employees: id } });
        }

        return res.json({ message: 'Employee updated successfully', employee });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findById(id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        if (employee.department) await Department.findByIdAndUpdate(employee.department, { $pull: { employees: id } });
        await Employee.findByIdAndDelete(id);

        return res.json({ message: 'Employee deleted successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
