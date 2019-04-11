var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TeacherSchema = new Schema({
    id: {type: String, required: true},
    subject: {type: String, required: true, max: 100},
    name: {type: String, required: true},
    age: {type: Number, required: true}
})

module.exports = mongoose.model('Teacher', TeacherSchema);