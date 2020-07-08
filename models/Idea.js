const mongoose = require('mongoose')

const IdeaSchema = new mongoose.Schema({
    user:{
        type:String,
        required: true
    },
    title:{
        type:String,
        required:true
    },
    details:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})

mongoose.model('ideas',IdeaSchema)

