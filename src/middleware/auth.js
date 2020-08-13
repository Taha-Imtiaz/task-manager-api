//validate json  web token
const jwt = require("jsonwebtoken")
//find the user in the database with that JWT
const User = require("../models/user")

const auth = async (req, res ,next) => {
try {
    //get the value for the header
    const token = req.header('Authorization').replace('Bearer ', '');
    //verify that token is valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    //find user in the database
    //check the value of provided token in tokens array
    const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

    if(!user) {
        throw new Error()
    }
    //give the route handler access to the user that is fetch from database
  //get the particular token which is used to authenticate
  req.token = token
  req.user = user
    next()

} catch (error) {
    res.status(401).send({error : "Please authenticate."})
}

}

module.exports = auth