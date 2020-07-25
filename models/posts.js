let mongoose = require('mongoose')
const postSchema = new mongoose.Schema({
    description: String,
    created: {
        type: Date,
        default: Date.now
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment"
    }],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        username: String
    },
    likes:[{type:String}]
});
module.exports = mongoose.model('post', postSchema);