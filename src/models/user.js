const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const Task = require("./task")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    // if email is already registered another user do not register with same email
    unique: true,
    required: true,
    //trim removes spaces
    trim: true,
    lowercase: true,
    //value parameter contains email we pass
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is Invalid");
      }
    },
  },
  age: {
    type: Number,
    //default value for age
    default: 0,
    //validation for age
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be a positive number");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error('Password does not contain the word "password"');
      }
    },
  },
  tokens : [{
      token : {
          type : String,
          required : true
      }
  }],
  //setup field for storing image buffer data
  avatar : {
    type : Buffer //store buffer with binary image data in the database with the user
  }
},{
  timestamps : true
});

 
//virtual property is not the data stored in the database,It is the relationship between two entities(user and task)
userSchema.virtual("tasks", {
  ref : "Task",
  localField : '_id', // (user id)
  foreignField: 'owner'
})

//toJSON behaves in the same way delete password and tokens
userSchema.methods.toJSON = function() {
    const user = this;
    //create raw object with user data
    const userObject = user.toObject()

    //delete password and tokens
    delete userObject.password
    delete userObject.tokens
    //delete avatar data
    delete userObject.avatar

    return userObject
}

//methods are used on the instance(indiviual user)
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    //generate jwt token
    const token = jwt.sign({_id : user._id.toString()}, process.env.JWT_SECRET)
   //add to token array
   user.tokens = user.tokens.concat({token: token});
   await user.save()

    return token

}
//methods on the model
//find by credentials will call whatever define on userSchema.statics
userSchema.statics.findByCredentials = async (email, password) => {
  //find user by email
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new Error("Unable to login");
  }
  //verify password
  // first argument is plain text pssword 2nd is hash password because  we  find a user
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return user;
};

//hash the plain text password before saving
//setting up middleware for user
userSchema.pre("save", async function (next) {
  //this refers to the user document that is going to be saves
  const user = this;

  //hash password (if password is modified otherwise do not hash password)
  //password modified at the time of creating or updating
  if (user.isModified("password")) {
    //hash password
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

//delete user tasks when user is removed(before removing user)
userSchema.pre('remove',async function(next) {
const user = this;
//delete all tasks using owner field(delete all tasks of particular user)

await Task.deleteMany({owner: user._id})

next()
})


//define a model
const User = mongoose.model("User", userSchema);

module.exports = User;
