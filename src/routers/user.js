const express = require("express");
const User = require("../models/user");
const {sendWelcomeEmail, sendCancellationEmail} = require("../emails/account") 
const router = new express.Router()
const auth = require("../middleware/auth")
const multer = require("multer")
const sharp = require("sharp")

// router.get("/test", (req , res) => {
//     res.send("From a new file")
// })

//create user
router.post('/users', async (req, res) => {
    //access postman request via req.body
    // console.log(req.body)
    // res.send("testing")
    const user = new User(req.body)
    
    try {
        //save the user
        await user.save();
        //send email
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    
    } catch (error) {
         //change the status code and send back error
        res.status(400).send(error)
    }
    
    })
    //logging existing users
    router.post('/users/login', async (req,res) => {
       try {
           const user = await User.findByCredentials(req.body.email, req.body.password)
          const token = await user.generateAuthToken()
           res.send({user, token})

        } catch (error) {
           res.status(400).send()
       } 
    })

    //logout from the app(logout requires authentication)
    router.post("/users/logout", auth, async (req,res) => {
        try {
            req.user.tokens = req.user.tokens.filter((tokenObj) => tokenObj.token !== req.token)
           
            //save the user
           await req.user.save()
            res.send()
        } catch (error) {
            res.status(500).send()
        }
    })
    //logout from all sessions(table,pc,laptop,mobile)
    router.post("/users/logoutAll", auth, async (req, res) => {
        try {
            req.user.tokens = []
           await req.user.save()
           res.send()

        } catch (error) {
            res.status(500).send()
        }
    })


    //fetch multiple users
    //fetch authenticated user(not multiple users)
    router.get("/users/me", auth , async (req,res) => {
        //we can call route handler if middleware calls next()

        //user can see his own data after authentication not all the data from database
        //send the user in response
        res.send(req.user)

    //    try {
    //      // find all documents of user because object is empty
    //        const users = await User.find({})
    //        res.send(users)
    //    } catch (error) {
    //        res.status(500).send()
    //    }
    })

    //we are only fetching authenticated user so there is no need to fetch user by id
    
    //fetch single user
    // router.get("/users/:id", async (req, res) => {
    //      //req.params() contains all the route parameters inthis case dynamic id
    //     const _id = req.params.id
    
    //     try {
    //         const user = await User.findById(_id);
    //         if(!user) {
    //             console.log("user not found")
    //             return res.status(404).send()
    //         }
    //            res.send(user)
    //     } catch (error) {
    //         res.status(500).send()
    //     }
    // })
    
    //updating endpoints for user
    router.patch("/users/me", auth, async (req, res) => {
        //check to update only those properties exists in database
       //try to access keys ofobject in postman
        const updates = Object.keys(req.body);
        const allowedUpdates = ['name', 'email', 'password', 'age'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    
        if(!isValidOperation) {
            return res.status(400).send({error: "Invalid updates"})
        }
        
        
        try {
            //access the whole object you want to update via req.body
            //new always returns a new user (updated user) the original user with updates apply
            //validator is that object is valid (exists in the database )
           
            // const user = await User.findById(req.params.id)
            updates.forEach((update) =>  req.user[update] = req.body[update])
            await req.user.save()
           // const user =  await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        
        //wrong id(user dont exist with that id)
        // if(!user) {
        //     return res.status(404).send()
        // }
        res.send(req.user)
        
        } catch (error) {
            //handle validation error
    
            res.status(400).send(error)
            //handle server (database) error
        }
    })
    
    //deleting user
    router.delete("/users/me", auth, async (req, res) => {
    try {
    //     const user = await User.findByIdAndDelete(req.user._id)
    // if(!user) {
    //     return res.status(404).send()
    // }
    //remove user
   await req.user.remove()
   //sending email to the user
   sendCancellationEmail(req.user.email,req.user.name)
    res.send(req.user)
    
    } catch (error) {
        res.status(500).send()
    }
    })
    //upload image
const upload = multer({
    // dest: "avatars", //directory that store images
    limits:{
        fileSize: 1000000
    },
     
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error("Please upload an image"))
        }
        cb(undefined, true) //if it is image
    }
})


router.post("/users/me/avatar", auth, upload.single('avatar'), async (req, res) => {
   //save image in user profile
   //store buffer data on user avatar field
    //save image to the database(convert modified image to buffer i.e type is png and size is reduced)
   const buffer = await sharp(req.file.buffer).resize({width: 250, height : 250}).png().toBuffer()
    req.user.avatar = buffer
   //req.user.avatar =  req.file.buffer   //access image buffer data in route handler 
 //save user profile because we upload image
 await req.user.save()  
 res.send()
},(error, req, res, next) => {
    res.status(400).send({error: error.message})
})

//delete the image
router.delete("/users/me/avatar", auth, async (req, res) => {
    req.user.avatar = undefined //delete buffer image
    await req.user.save()
    res.send()
})
//get the image(fetching avatar)
router.get("/users/:id/avatar", async (req, res) => {
    //getting the avatar for the user
    try {
        //fetching user
        const user = await User.findById(req.params.id)
        //if no user or user with no image field
        if(!user || !user.avatar) {
            throw new Error()
        }
        //send back the correct data
        //tell the requseter what type of data it is .png,.jpg,.jpeg

        res.set("Content-Type", "image/png")
        //access image for user by id
        res.send(user.avatar)

    } catch (error) {
        res.status(404).send()
    }

})
module.exports = router