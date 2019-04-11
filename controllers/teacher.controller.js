const JSON = require('circular-json');
const Teacher = require('../models/teacher.model');
const uuid = require('uuid');

exports.home = function (req, res) {
    Teacher.find({}, (err, result) => res.render('teacher_home', {listOfTeacher: result}));
}

exports.create = function (req, res) {
    var id = uuid();
    var name = req.body.name;
    var age = parseInt(req.body.age);
    var subject = req.body.subject;

    Teacher.create(
        {
            'name': name,
            'age': age,
            'subject': subject,
            'id': id
        },
        function (err, result) {
            if (err) console.log(err);
            else res.redirect('/teachers');
        }
    )
}

exports.find = function (req, res) {
    let id = req.params.id;

    Teacher.find(
        {'id': id},
        function(err, result) {
            res.render('one_teacher', {teacher: result[0]});
        }
    );
}

exports.update = function (req, res) {
    let id = req.params.id;
    let name = req.body.name;
    let age = parseInt(req.body.age);
    let subject = req.body.subject;
    let query = {'id': id};

    Teacher.findOneAndUpdate(
        query,
        {$set:
            {
                'name': name,
                'age': age,
                'subject': subject
            }
        },
        function (err, result) {
            if (err) console.log(error);
            else res.redirect('/teachers');
        }
    )
}

exports.delete = function (req, res) {
    let id = req.params.id;
    let query = {'id': id};

    Teacher.deleteOne(
        query,
        function (err) {
            if (err) (console.log(err));
            else res.redirect('/teachers');
        }
    );
}