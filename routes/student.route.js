const express = require('express');
const router = express.Router();

const student_controller = require('../controllers/student.controller');

router.get('/', student_controller.home);
router.post('/create', student_controller.create);
router.get('/find/:id', student_controller.find);
router.put('/update/:id', student_controller.update);
router.get('/delete/:id', student_controller.delete);

module.exports = router;