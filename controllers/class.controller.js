const JSON = require('circular-json');
const Class = require('../models/class.model');
const Teacher = require('../models/teacher.model');
const Student = require('../models/student.model');
const uuid = require('uuid');

exports.home = function (req, res) {
    Teacher.find(
        {},
        function (err, result) {
            var listOfTeacher = result;
            Class.aggregate([
                {
                    "$lookup": {
                        "from": "teachers",
                        "localField" : "teacherId",
                        "foreignField": "id",
                        "as": "teacher_docs"
                    },
                }
            ]).exec(function(err, result) {
                var listOfClass = result;
                res.render(
                    'class_home',
                    {
                        listOfTeacher: listOfTeacher,
                        listOfClass: listOfClass
                    }
                );
            })
        }
    );
}

exports.create = function (req, res) {
    let name = req.body.name;
    let teacherId = req.body.teacherId;
    Class.create(
        {
            id: uuid(),
            name: name,
            teacherId: teacherId,
        },
        function(err, result) {
            if (err) console.log(err);
            else res.redirect('/classes');
        }
    )
}

exports.find = function (req, res) {
    let id = req.params.id;
    Class.find(
        {'id': id},
        function(err, result) {
            var theClass = result[0];
            var teacherId = result[0].teacherId;
            Teacher.find(
                {},
                function (err, result) {
                    var listOfTeacher = result;
                    var teacher;
                    for (let i = 0; i < listOfTeacher.length; i++) {
                        if (listOfTeacher[i].id === teacherId) {
                            teacher = listOfTeacher[i];
                            break;
                        }
                    }
                    res.render(
                        'one_class',
                        {
                            theClass: theClass,
                            listOfTeacher: listOfTeacher,
                            teacher: teacher
                        }
                    );
                }
            )
        }
    )
}

exports.update = function (req, res) {
    let new_name = req.body.name;
    let teacherId = req.body.teacherId;
    let id = req.params.id;
    Class.findOneAndUpdate(
        {id: id},
        {
            $set: {
                name: new_name,
                teacherId: teacherId
            }
        },
        function(err, result) {
            if (err) console.log(err);
            else res.redirect('/classes');
        }
    );
}

exports.delete = function (req, res) {
    let id = req.params.id;
    Class.findOneAndRemove(
        {id: id},
        function(err, result) {
            if (err) console.log(err);
            else res.redirect('/classes');
        }
    );
}

exports.showFilteredStudent = function (req, res) {
    let id = req.params.id;
    Class.aggregate([
        {
            "$match": {"id": id}
        },

        {
            "$lookup": {
                "from": "teachers",
                "localField": "teacherId",
                "foreignField": "id",
                "as": "teacher_docs"
            }
        },
    ]).exec(function(err, result){
        var theClass = result[0];
        var allStudentList;
        var filteredStudentList = [];
        function inClassStudentList(studentId) {
            var found = false;
            for (let i = 0; i < theClass.listOfStudentId.length; i++) {
                if (theClass.listOfStudentId[i] === studentId) {
                    found = true;
                    break;
                }
            }
            return found;
        }
        Student.find(
            {},
            function(err, result) {
                if (err) console.log(err);
                else {
                    allStudentList = result;
                    for (let i = 0; i < allStudentList.length; i++) {
                        if (!inClassStudentList(allStudentList[i].id)) {
                            filteredStudentList.push(allStudentList[i]);
                        }
                    }
                    res.render(
                        'addStudent',
                        {
                            'theClass': theClass,
                            'filteredStudentList': filteredStudentList
                        }
                    );
                }
            }
        );
    })
}

exports.addStudent = function (req, res) {
    let id = req.params.id;
    let obj = req.body;
    let listOfStudentId;

    Class.find(
        {'id': id},
        function(err, result) {
            if (err) console.log(err);
            else {
                listOfStudentId = result[0].listOfStudentId.slice(0, result[0].listOfStudentId.length);
                for (var key in obj) {
                    listOfStudentId.push(obj[key]);
                }

                Class.findOneAndUpdate(
                    {'id': id},
                    {
                        $set: {
                            listOfStudentId: listOfStudentId
                        }
                    },
                    function(err, result) {
                        if (err) console.log(err);
                        else {
                            res.redirect("/classes");
                        }
                    }
                )
            }
        }
    )
}

exports.showStudentInClass = function (req, res) {
    let class_id = req.params.id;
    let classWithStudentInfo;
    let classWithTeacherInfo;
    Class.aggregate([
        {
            "$match": {"id": class_id}
        },
        {
            "$unwind": "$listOfStudentId"
        },
        {
            "$lookup": {
                "from": "students",
                "localField": "listOfStudentId",
                "foreignField": "id",
                "as": "student_docs"
            }
        },
        {
            "$match": {"student_docs": {$ne: []}}
        }
    ]).exec(function(err, result){
        classWithStudentInfo = result;
        Class.aggregate([
            {
                "$match": {"id": class_id}
            },
            {
                "$lookup": {
                    "from": "teachers",
                    "localField": "teacherId",
                    "foreignField": "id",
                    "as": "teacher_docs"
                    }
            },
        ]).exec(function(err, result){
            classWithTeacherInfo = result[0];
            res.render(
                'showStudent',
                {
                    classWithStudentInfo: classWithStudentInfo,
                    classWithTeacherInfo: classWithTeacherInfo
                }
            );
        })
    })
}

exports.deleteStudent = function(req, res) {
    let obj = req.body;
    let class_id = req.params.id;
    let listOfDeletedStudentId = [];
    let listOfStudentId;
    let updatedListOfStudentId = [];
    for (var key in obj) {
       listOfDeletedStudentId.push(obj[key]);
    }
    Class.find(
        {"id": class_id},
        function(err, result) {
            function foundInDeletedStudentList(studentId) {
                var found = false;
                for (let i = 0; i < listOfDeletedStudentId.length; i++) {
                    if (listOfDeletedStudentId[i] === studentId) {
                        found = true;
                        break;
                    }
                }
                return found;
            }
            if (err) console.log(err);
            else {
                listOfStudentId = result[0].listOfStudentId;
                for (let i = 0; i < listOfStudentId.length; i++) {
                    if (!foundInDeletedStudentList(listOfStudentId[i])) {
                        updatedListOfStudentId.push(listOfStudentId[i]);
                    }
                }
                Class.findOneAndUpdate(
                    {"id": class_id},
                    {
                        "$set": {"listOfStudentId": updatedListOfStudentId}
                    },
                    function(err, result){
                        if (err) console.log(err);
                        else res.redirect("/classes");
                    }
                )
            }
        }
    )
}