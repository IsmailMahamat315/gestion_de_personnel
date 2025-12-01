// routes/employee.js
const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware); // protège toutes les routes

router.get('/', employeeController.findAll);
router.get('/:id', employeeController.findOne);
router.post('/', employeeController.create);
router.put('/:id', employeeController.update);
router.delete('/:id', employeeController.delete);

module.exports = router;