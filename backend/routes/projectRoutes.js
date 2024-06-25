const express = require('express')

const Project = require('../models/project.model')

const router = express.Router();

router.post('/addProject', async (req,res)=>{
    try{
        if(!req.body.name,!req.body.level , !req.body.budget,!req.body.description ,!req.body.dateofstarting ,!req.body.status ){
            return res.status(400).json({message:'Enter all required fields'});
        }

        const newProject = {
            name:req.body.name,
            level:req.body.level,
            budget:req.body.budget,
            description:req.body.description,
            dateofstarting:req.body.dateofstarting,
            status:req.body.status
        }

        const project = await Project.create(newProject);

        return res.status(201).json(project);
    }
    catch(error){
        res.status(500).json({error:true,message:error.message});
    }
});

router.get("/getProject/:pid",async(req,res)=>{
    const pid = req.params.pid;
    try{
        console.log(pid);
        const project = await Project.findOne({_id:pid});
        res.status(201).json(project);
    }catch(error){
        res.status(500).json({error:true,message:error.message});
    }
});

router.get("/getProjects",async(req,res)=>{
    const pid = req.params.pid;
    try{
        console.log(pid);
        const project = await Project.find();
        res.status(201).json(project);
    }catch(error){
        res.status(500).json({error:true,message:error.message});
    }
});

router.put("/updateStatus/:pid",async(req,res)=>{
    const pid = req.params.pid;
    try{
        console.log(pid);
        const project = await Project.findOne({_id:pid});
        if(!project){
            return res.status(400).json({error:true,message:"Project not found"});
        }
        if(project)
        res.status(201).json(project);
    }catch(error){
        res.status(500).json({error:true,message:error.message});
    }
});

module.exports = router;