const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
//create new express application
const app = express();

const port = process.env.PORT 


//how to upload files to express using multer
// const multer = require("multer")
//create new instance of multer
// const upload = multer({
// dest : "images", // dest is destination and images is the images folder where all images upload 
// limits:{
//   fileSize : 1000000 //1mb size(set the file size in bytes)
// },
//filter files that do not want be uploaded
//this function is internally called by multer
// fileFilter(req, file, cb) {
// if(!file.originalname.endsWith(".pdf")) {
//   //if file is not pdf
//   return cb(new Error("Please upload a PDF!"))
// }

//cb(undefined, true) //it is a pdf file no error

// if(!file.originalname.match(/\.(doc|docx)$/)) {
//   return cb(new Error("Please upload a word document"))
// }
// cb(undefined, true) //it is word document

// cb(new Error("File must be a PDF!")) //provide error
// cb(undefined, true) //if upload is accepted
// cb(undefined, false) //if upload is rejected
// }

// })
//create error middleware
// const errorMiddleware = (req, res, next) => {
//   throw new Error("From my middleware")
// }

//setup(create) endpoint where client upload images
// app.post("/upload", upload.single("upload") , (req, res) => {
// res.send()
// },(error, req, res, next) => {
// res.status(400).send({error : error.message})
// })



//register middware before app.use
// app.use((req, res, next) => {
// // console.log(req.method, req.path)
// //call next
// // next()
// if (req.method === "GET") {
// res.send("GET requests are disabled")
// } else {
// next()
// }
// })

// app.use((req,res, next) => {
//         res.status(503).send("Site is in maiintainance mode! Please try again soon")
// })

//parse the incoming JSON to object
app.use(express.json());
//register user router
app.use(userRouter);
app.use(taskRouter);

// //create new router with express
// const router = new express.Router()
// //get error in test route because it is not registered.
// router.get("/test", (req, res) => {
//     res.send("This is from my other router")
// })
// //register new router with an app
// app.use(router)

//without middleware: new request => run route handler
//with middleware: new request => do something => run route handler

app.listen(port, () => {
  console.log("Server is up on port " + port);
});

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const myFunction = async () => {
  //plain text password that user provides
  const password = "Red12345!";
  //coverting plain text into hashed password
  //bcrypt returns promise . 2nd argument in bcrypt.hash is no of rounds i.e how many times algorithm is executed
  const hashedPassword = await bcrypt.hash(password, 8);

  console.log(password);
  console.log(hashedPassword);

  //compare Password with the hashed password stored in the database
  const isMatch = await bcrypt.compare("Red12345!", hashedPassword);
  console.log(isMatch);
};
const mynewFunction = async () => {
  //create json web token
  const token = jwt.sign({ _id: "abc123" }, "this is my new course", {
    expiresIn: "7 days",
  });
  console.log(token);

  //verify json web token
  const data = jwt.verify(token, "this is my new course");
  console.log(data);
};
// hashing algo
//pass123 => ggtkjeerurereiriejtrgl

// myFunction();
// mynewFunction();

// const pet = {
//     name: 'Hal'
// }
// pet.toJSON = function() {
//     // console.log(this)
//     // return this
//     return {}
// }
// //convert object to JSON
// console.log(JSON.stringify(pet))

const Task = require("./models/task");
const User = require("./models/user");

const main = async () => {
  //find user when task is given
  //find task by its id
  // const task = await Task.findById("5f2ed000d9b2ab5f3c6909ef")
  //generate profile of owner using populate()
  //find the owner associated (created) with this task
  // await task.populate("owner").execPopulate()
  //task.owner is whole profile of the user
  // console.log(task.owner)

  //find task when user is given
  // const user = await User.findById("5f2ecd03b4aac95b0c9556c2");
  //generate profile of task
  //find all task created by this user
  // await user.populate("tasks").execPopulate();
  // console.log(user.tasks);
};
// main();


