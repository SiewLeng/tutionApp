const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const teacher = require('./routes/teacher.route');
const group = require('./routes/class.route');
const student = require('./routes/student.route');
const main = require('./routes/main.route');

const app = express();

const mongoose = require ('mongoose');
const mongoDB = 'mongodb://127.0.0.1:27017/TutionClass';
mongoose.connect(mongoDB);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/teachers', teacher);
app.use('/classes', group);
app.use('/students', student);
app.use('/', main);

app.set('view engine', 'ejs');

let port = 3000;
app.listen(port, ()=>{
    console.log('Sever is up and running on port number' + port);
})