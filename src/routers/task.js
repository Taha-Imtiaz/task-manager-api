const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth")
const router = new express.Router()

//setup task model
//create task
router.post("/tasks", auth, async (req, res) => {
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    
    try {
        await task.save()
        res.status(201).send(task)
    
    } catch (error) {
        res.status(400).send(error)
    }
    })
    
    //fetch multiple tasks
    // GET /tasks?completed:false(get all tasks where completed is false)
    //GET /tasks?limit = 10(fetch 10 task)&skip=10.
    //GET /tasks?sortBy= createdAt:desc(sort task using createdAt in decending order)
    router.get("/tasks", auth, async (req, res) => {
    //   req.query.completed //gets the completed value in url
     
    const match = {}
    const sort = {}

        if(req.query.completed) {
            match.completed = req.query.completed === "true"
        }

        if(req.query.sortBy) {
            const parts = req.query.sortBy.split(":");
            sort[parts[0]] = parts[1] === "desc" ? -1 : 1
        }

    try {
     // find all documents of user because object is empty
     //find all the task of specific user
     //   const tasks = await Task.find({owner: req.user._id});
       
     await req.user.populate({
         path : "tasks",
         match : match,
         //show 2 resultson 1 page
         options:{
            limit : parseInt(req.query.limit) ,
            skip : parseInt(req.query.skip),
            sort: sort
            // sort: {
                // createdAt : -1 //sort data on the basis of createdAt in descending order
                // createdAt : 1 //sort data on the basis of createdAt in ascending order
                // completed:-1 //(sort the completed tasks in descending order)
                // completed : 1 //(sort the completed tasks in ascending order)
            // }
         }
     }).execPopulate()
     res.send(req.user.tasks)
      } catch (error) {
        res.status(500).send()
      }
    })
    
    //fetch single task
    router.get("/tasks/:id", auth, async (req, res) => {
        const _id =req.params.id;
        
        try {
          
            //const task = await Task.findById(_id)  
            const task = await Task.findOne({_id : _id, owner: req.user._id})
          if(!task) {
            console.log("Task not found");
             return res.status(404).send()
       }
       res.send(task)
        } catch (error) {
            res.status(500).send()
        }
    })
    //update task
    router.patch("/tasks/:id",auth, async (req,res) => {
    
        const updates = Object.keys(req.body);
        const allowedUpdates = ['description', 'completed' ]
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    
        if(!isValidOperation) {
            return res.status(400).send({error: "Invalid Updates"})
        }
        try {
            const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
            // const task = await Task.findById(req.params.id);
            
            // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators : true});
            if(!task) {
              return res.status(404).send()
            }
            updates.forEach((update) => task[update] = req.body[update])
          await task.save()

            res.send(task)
        
        } catch (error) {
            //handle validation error
            res.status(400).send(error)
        }
    
    })
    
    //delete task
    router.delete("/tasks/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        // const task = await Task.findByIdAndDelete(req.params.id);
    
        if(!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
    })
    
    module.exports = router