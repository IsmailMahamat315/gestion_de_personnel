// models/employee.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const employeeSchema = new Schema(
    {
        name: { type: String, required: true },
        surname: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { 
            type: String, 
            enum: ['admin', 'employee', 'manager'], // ← Ajoutez 'manager' ici
            default: 'employee' 
        },
        department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);