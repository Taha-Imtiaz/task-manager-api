const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
    description: {
        type : String,
        trim: true,
        required : true
    }, 
    completed:{
        type : Boolean,
        default : false
    }, 
    owner : {
        //data is objectId
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        //reference of user for relationship between users and tasks for easily fetching user profile
        ref: "User"
    }
    },{
        timestamps: true
    })

const Task = mongoose.model("Task", taskSchema)

    module.exports = Task