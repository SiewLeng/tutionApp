const JSON = require('circular-json');
const uuid = require('uuid');
const Class = require('../models/class.model');
const Student = require('../models/student.model');

exports.home = function (req, res) {
    Student.find(
        {},
        function (err, result) {
            var listOfStudent = result;
            res.render(
                'student_home',
                {'listOfStudent': listOfStudent}
            );
        }
    );
}

exports.create = function (req, res) {
    let name = req.body.name;
    let age = parseInt(req.body.age);
    Student.create(
        {   'id': uuid(),
            'name': name,
            'age': age
        },
        function(err, result){
            if (err) console.log(err);
            else res.redirect('/students');
        }
    )
}

exports.find = function (req, res) {
    let id = req.params.id;
    Student.find(
        {id: id},
        function(err, result) {
            var student;
            if (err) console.log(err);
            else {
                student = result[0];
                res.render(
                    'one_student',
                    {student: student}
                );
            }
        }
    )
}

exports.update = function (req, res) {
    let id = req.params.id;
    let name = req.body.name;
    let age = parseInt(req.body.age);
    Student.findOneAndUpdate(
        {'id': id},
        {$set:
            {
                name: name,
                age: age,
            }
        },
        function(err, result) {
            if (err) console.log(err);
            else res.redirect("/students");
        }
    );
}

exports.delete = function (req, res) {
    let id = req.params.id;
    Student.findOneAndRemove(
        {'id': id},
        function(err, result) {
            if (err) console.log(err);
            else res.redirect('/students');
        }
    );
}