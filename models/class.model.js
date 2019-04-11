var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ClassSchema = new Schema({
    id: {type: String, required: true},
    name: {type: String, required: true, max: 100},
    teacherId: {type: String, required: true},
    listOfStudentId: {type: [String], required: true}
})

module.exports = mongoose.model('Class', ClassSchema);