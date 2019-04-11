const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

let StudentSchema = new Schema({
    id: {type:String, required:true},
    name: {type: String, required: true},
    age: {type: Number, required: true}
})

module.exports = mongoose.model('Student', StudentSchema);