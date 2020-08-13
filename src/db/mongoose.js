const mongoose = require("mongoose")
const validator = require("validator")

//connect to the database
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    // useCreateIndex is used when mongoose works with mongodb our indexes are created and we can easily access data
    useCreateIndex: true,
    //remove useFindAndModify depcrecation warning
    useFindAndModify: false
})

//create instance of a model
// const me = new User({
//    name : "   Taha  ",
//     email : "TAHAIMTIAZ1996@GMAIL.COM ",
// //    age: -1
//     password :"pass123"
// })
// //save model instance to the database
// // me.save() returns a promise
// me.save().then((me) => {
// console.log(me)
// }).catch((error) => {
// console.log("Error", error)
// })
//create task model

//create new intance of task model
// const createdTask = new Task({
//     description: "  I created a new task",
//     // completed : true
// })
// //save a model to the database
// createdTask.save().then((newTask) => {
//     console.log(newTask)
// }).catch((error) => {
//     console.log(error)
// })