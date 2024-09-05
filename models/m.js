const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const todoSchema = new Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        minLength: 3,
        maxLength: 15
    },
    status:{
        type:String,
        enum:["Todo", "In progress", "Done"],
        default:"Todo"
    },
    userID:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'user'
    }
})

const todoModel = mongoose.model("todo", todoSchema)

module.exports = todoModel;