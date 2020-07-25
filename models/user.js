let mongoose = require('mongoose'),
    passportlocalmongoose = require('passport-local-mongoose')

let UserSchema = new mongoose.Schema({
    username: String,
    firstname: {
        type: String,
        default: 'First Name'
      },
    lastname: {
        type: String,
        default: 'Last Name'
      },
    bio:{
        type: String,
        default: 'Add Bio'
      },
    hometown:{
        type: String,
        default: 'No info available'
      },
    workplace:{
        type: String,
        default: 'No info available'
      },
    education:{
        type: String,
        default: 'No info available'
      },
    contact:{
        type: Number,
        default: 999999999
      },
    password: String,
    friends:[{type:String}],
    friend_requests:[{type:String}]
})

UserSchema.plugin(passportlocalmongoose)
module.exports = mongoose.model('user', UserSchema)