// seeders/databaseSeeder.js
const Department = require('../models/department');
const Employee = require('../models/employee');
const bcrypt = require('bcryptjs');

const databaseSeeder = async () => {
    try {
        // Vider les collections existantes
        await Employee.deleteMany({});
        await Department.deleteMany({});

        // Hasher un mot de passe par défaut
        const hashedPassword = await bcrypt.hash('password123', 10);

        // Créer les départements
        const generalDentistry = await new Department({name: 'General Dentistry'}).save();
        const pediatricDentistry = await new Department({name: 'Pediatric Dentistry'}).save();
        const restorativeDentistry = await new Department({name: 'Restorative Dentistry'}).save();
        const surgeryDentistry = await new Department({name: 'Surgery Dentistry'}).save();
        const orthodontics = await new Department({name: 'Orthodontics'}).save();

        // Créer les employés avec tous les champs requis
        const alfred = await new Employee({
            name: 'Alfred', 
            surname: 'Christensen', 
            email: 'alfred.christensen@dentist.com',
            password: hashedPassword,
            role: 'manager', // ← Maintenant 'manager' est autorisé
            department: generalDentistry._id
        }).save();

        const john = await new Employee({
            name: 'John', 
            surname: 'Dudley', 
            email: 'john.dudley@dentist.com',
            password: hashedPassword,
            role: 'employee',
            department: generalDentistry._id
        }).save();

        const janet = await new Employee({
            name: 'Janet', 
            surname: 'Doe', 
            email: 'janet.doe@dentist.com',
            password: hashedPassword,
            role: 'employee',
            department: generalDentistry._id
        }).save();

        const francisco = await new Employee({
            name: 'Francisco', 
            surname: 'Willard', 
            email: 'francisco.willard@dentist.com',
            password: hashedPassword,
            role: 'manager', // ← Manager du département pédiatrique
            department: pediatricDentistry._id
        }).save();

        const sarah = await new Employee({
            name: 'Sarah', 
            surname: 'Alvarez', 
            email: 'sarah.alvarez@dentist.com',
            password: hashedPassword,
            role: 'employee',
            department: pediatricDentistry._id
        }).save();

        const lisa = await new Employee({
            name: 'Lisa', 
            surname: 'Harris', 
            email: 'lisa.harris@dentist.com',
            password: hashedPassword,
            role: 'manager', // ← Manager du département restaurateur
            department: restorativeDentistry._id
        }).save();

        const danny = await new Employee({
            name: 'Danny', 
            surname: 'Perez', 
            email: 'danny.perez@dentist.com',
            password: hashedPassword,
            role: 'employee',
            department: restorativeDentistry._id
        }).save();

        const constance = await new Employee({
            name: 'Constance', 
            surname: 'Smith', 
            email: 'constance.smith@dentist.com',
            password: hashedPassword,
            role: 'manager', // ← Manager du département chirurgie
            department: surgeryDentistry._id
        }).save();

        const leslie = await new Employee({
            name: 'Leslie', 
            surname: 'Roche', 
            email: 'leslie.roche@dentist.com',
            password: hashedPassword,
            role: 'manager', // ← Manager du département orthodontie
            department: orthodontics._id
        }).save();

        const travis = await new Employee({
            name: 'Travis', 
            surname: 'Combs', 
            email: 'travis.combs@dentist.com',
            password: hashedPassword,
            role: 'employee',
            department: orthodontics._id
        }).save();

        // Créer aussi un administrateur général
        const admin = await new Employee({
            name: 'Admin',
            surname: 'System',
            email: 'admin@dentist.com',
            password: hashedPassword,
            role: 'admin', // ← Rôle admin
            department: generalDentistry._id
        }).save();

        // Mettre à jour les départements avec les employés
        await Department.findByIdAndUpdate(generalDentistry._id, { 
            $push: { employees: { $each: [alfred._id, john._id, janet._id, admin._id] } }
        });

        await Department.findByIdAndUpdate(pediatricDentistry._id, { 
            $push: { employees: { $each: [francisco._id, sarah._id] } }
        });

        await Department.findByIdAndUpdate(restorativeDentistry._id, { 
            $push: { employees: { $each: [lisa._id, danny._id] } }
        });

        await Department.findByIdAndUpdate(surgeryDentistry._id, { 
            $push: { employees: constance._id }
        });

        await Department.findByIdAndUpdate(orthodontics._id, { 
            $push: { employees: { $each: [leslie._id, travis._id] } }
        });

        console.log('✅ Database seeder completed successfully!');
        console.log('📊 Statistics:');
        console.log(`   - Departments created: 5`);
        console.log(`   - Employees created: 11`);
        console.log(`   - Roles: 1 admin, 4 managers, 6 employees`);
        console.log('🔑 Default password for all users: "password123"');
        console.log('👤 Admin account: admin@dentist.com / password123');
        
    } catch (error) {
        console.error('❌ Seeder error:', error.message);
    }
};

module.exports = databaseSeeder;