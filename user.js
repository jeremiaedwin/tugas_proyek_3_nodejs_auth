// dependencies
const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

// connect to database
mongoose.connect('mongodb://localhost/users',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// create model
const Schema = mongoose.Schema;

const User = new Schema({
    username: String,
    password: String
});

// export model
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('userData', User, 'userData');

