let mongoose = require('mongoose'),
    passportlocalmongoose = require('passport-local-mongoose')

let UserSchema = new mongoose.Schema({
    username: String,
    password: String
})

UserSchema.plugin(passportlocalmongoose)
module.exports = mongoose.model('user', UserSchema)