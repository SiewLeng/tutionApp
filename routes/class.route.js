const express = require('express');
const router = express.Router();

const class_controller = require('../controllers/class.controller');

router.get('/', class_controller.home);
router.post('/create', class_controller.create);
router.get('/find/:id', class_controller.find);
router.put('/update/:id', class_controller.update);
router.get('/delete/:id', class_controller.delete);
router.get('/addStudent/:id', class_controller.showFilteredStudent);
router.put('/addStudent/:id', class_controller.addStudent);
router.get('/showStudent/:id', class_controller.showStudentInClass);
router.delete('/deleteStudent/:id', class_controller.deleteStudent);

module.exports = router;