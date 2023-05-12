const mongoose = require('mongoose');
const {Schema} = mongoose; //otherwise I would have to write mongoose.Schema()

const UserSchema = new Schema({
    username: String,
    password: String,
    passwordConfirmation: String,
    name: String,
    surname: String,
    email: {type: String, unique:true},
    tel: String,
    role: String,
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;