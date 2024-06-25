


const express = require('express')

const User = require('../models/user.model')

const Project =  require('../models/project.model')

const router = express.Router();


router.post('/userLogin', async (req, res) => {
    try {
      // console.log("ytfdsasdfgh");
      const email = req.body.email;
      // const pwd = req.query.pwd;
  
      const user = await User.findOne({ email:email });
  
      if (!user) {
        return res.status(400).send({ message: 'Invalid admin details', status: false });
      }
      // console.log("ytfdsasdfgh");
      // Replace `pwd` with the actual password field you are checking against
      if (user.password !== req.body.password) {
        return res.status(400).send({ message: 'Invalid admin details', status: false });
      }
  
      return res.status(200).send({ message: 'Login Successful', status: true });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  });

router.post('/addUser', async (req,res)=>{
    try{
        if(!req.body.fullName || !req.body.email || !req.body.type || !req.body.password || !req.body.projects ){
            return res.status(400).send({message:'Enter all required fields: fullname, email, type, password'});
        }

        const newUser = {
            fullName:req.body.fullName,
            email:req.body.email,
            type:req.body.type,
            password:req.body.password,
            projects:req.body.projects,
        }

        const user = await User.create(newUser);

        return res.status(201).json(user);
    }
    catch(error){
        if(error.code==11000){
            console.error('Duplicate email detected');
            res.status(500).send({message:'Duplicate email detected'});
        }
        else{
            console.log(error);
            res.status(500).send({message:error.message});
        }
    }
});

router.get('/getAllUserDetails', async (req,res)=>{
    try{
        const users = await User.find({});
        return res.status(200).json(users);
    }
    catch(error){
        console.log(error);
        res.status(500).send({message:error.message});
    }
});


router.get('/getUserDetailsById', async (req,res)=>{
    try{
        const id = req.body._id;

        const user = await User.findById(id);

        return res.status(200).send(user);
    }
    catch(error){
        console.log(error);
        res.status(500).send({message:error.message});
    }
});

router.post('/getUserDetailsByEmail', async (req,res)=>{
    try{
        const email = req.body.email;
        console.log(email);
        const user = await User.find({email:email});

        return res.status(200).send(user);
    }
    catch(error){
        console.log(error);
        res.status(500).send({message:error.message});
    }
});

// router.put('/upload', async (req,res)=>{
//         const newProject = {projectId: req.body._id, status : 0}

//         const userLevel1 = await User.findOne({type:"level1"});
//         const userId= userLevel1._id;
//         const projectId=req.body._id;

//         try {
//             const updatedUser = await User.findOneAndUpdate(
//                 { _id: userId, 'projects.projectId': projectId },
//                 { $set: { 'projects.$.status': 1 } },
//                 { new: true, useFindAndModify: false }
//             );
    
//             if (!updatedUser) {
//                 res.status(404).send('User or project not found');
//             }
    
//             res.status(200).json(updatedUser);
//         } catch (err) {
//             console.error('Error updating project status:', err);
//             res.status(500).send('Internal server error');
//         }

//         const userLevel2 = await User.findOne({type:"level2"});
//         // console.log(req.body._id);
//         const user2Id = userLevel2._id;
//         // console.log(user._id);


//     try{
//         try {
//             const updatedUser = await User.findByIdAndUpdate(
//                 user2Id,
//                 { $push: { projects: newProject } },
//                 { new: true, useFindAndModify: false }
//             );
    
//             if (!updatedUser) {
//                 return res.status(404).send('User not found');
//             }
    
//             res.status(200).json(updatedUser);
//         } catch (err) {
//             console.error('Error adding project:', err);
//             res.status(500).send('Internal server error');
//         }

        
//         // if(!result){
//         //     return res.status(400).json({message:'Person Not Found'});
//         // }

//         // return res.status(200).send({message:'Person Details are Updated Successfully'});
//     }
//     catch(error){
//         console.log(error);
//         res.status(500).send({message:error.message});
//     }
// });


router.put('/upload', async (req, res) => {
    const newProject = { projectId: req.body._id, status: 0 };
    const projectId = req.body._id;

    try {
        // Find user level 1
        const userLevel1 = await User.findOne({ type: "level1" });
        if (!userLevel1) {
            return res.status(404).send('User level 1 not found');
        }
        const userId = userLevel1._id;

        // Update the project status for user level 1
        const updatedUser1 = await User.findOneAndUpdate(
            { _id: userId, 'projects.projectId': projectId },
            { $set: { 'projects.$.status': 1 } },
            { new: true, useFindAndModify: false }
        );

        if (!updatedUser1) {
            return res.status(404).send('User level 1 or project not found');
        }

        // Find user level 2
        const userLevel2 = await User.findOne({ type: "level2" });
        if (!userLevel2) {
            return res.status(404).send('User level 2 not found');
        }
        const user2Id = userLevel2._id;

        // Add the new project to user level 2
        const updatedUser2 = await User.findByIdAndUpdate(
            user2Id,
            { $push: { projects: newProject } },
            { new: true, useFindAndModify: false }
        );

        if (!updatedUser2) {
            return res.status(404).send('User level 2 not found');
        }

        // Update the project status in the Project database
        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            { $set: { status: 1 } },
            { new: true, useFindAndModify: false }
        );

        if (!updatedProject) {
            return res.status(404).send('Project not found');
        }

        // Send the final response
        res.status(200).json({ updatedUser1, updatedUser2, updatedProject });
    } catch (err) {
        console.error('Error during upload:', err);
        res.status(500).send('Internal server error');
    }
});


// well well working
// router.put('/upload', async (req, res) => {
//     const newProject = { projectId: req.body._id, status: 0 };

//     try {
//         // Find user level 1
//         const userLevel1 = await User.findOne({ type: "level1" });
//         if (!userLevel1) {
//             return res.status(404).send('User level 1 not found');
//         }
//         const userId = userLevel1._id;
//         const projectId = req.body._id;

//         // Update the project status for user level 1
//         const updatedUser1 = await User.findOneAndUpdate(
//             { _id: userId, 'projects.projectId': projectId },
//             { $set: { 'projects.$.status': 1 } },
//             { new: true, useFindAndModify: false }
//         );

//         if (!updatedUser1) {
//             return res.status(404).send('User level 1 or project not found');
//         }

//         // Find user level 2
//         const userLevel2 = await User.findOne({ type: "level2" });
//         if (!userLevel2) {
//             return res.status(404).send('User level 2 not found');
//         }
//         const user2Id = userLevel2._id;

//         // Add the new project to user level 2
//         const updatedUser2 = await User.findByIdAndUpdate(
//             user2Id,
//             { $push: { projects: newProject } },
//             { new: true, useFindAndModify: false }
//         );

//         if (!updatedUser2) {
//             return res.status(404).send('User level 2 not found');
//         }

//         // Send the final response
//         res.status(200).json({ updatedUser1, updatedUser2 });
//     } catch (err) {
//         console.error('Error during upload:', err);
//         res.status(500).send('Internal server error');
//     }
// });

router.put('/level2Accept', async (req, res) => {
    const projectId = req.body._id;

    try {
        // Find user level 2
        const userLevel2 = await User.findOne({ type: "level2" });
        if (!userLevel2) {
            return res.status(404).send('User level 2 not found');
        }
        const userId = userLevel2._id;

        // Delete the project from the level 2 user
        const updatedUser2 = await User.findByIdAndUpdate(
            userId,
            { $pull: { projects: { projectId } } },
            { new: true, useFindAndModify: false }
        );

        if (!updatedUser2) {
            return res.status(404).send('User level 2 or project not found');
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).send('Project not found');
        }

        // Check the budget and conditionally add to user level 3
        if (project.budget > 400000) {
            // Find user level 3
            const userLevel3 = await User.findOne({ type: "level3" });
            if (!userLevel3) {
                return res.status(404).send('User level 3 not found');
            }
            const user3Id = userLevel3._id;

            // Add the new project to user level 3
            const updatedUser3 = await User.findByIdAndUpdate(
                user3Id,
                { $push: { projects: { projectId, status: 0 } } },
                { new: true, useFindAndModify: false }
            );

            if (!updatedUser3) {
                return res.status(404).send('User level 3 not found');
            }

            // // Update the project status in the Project database
            // project.status = 0;
            // await project.save();

            // Send the final response
            return res.status(200).json({ updatedUser2, updatedUser3, project });
        } else {
            // Update the status of level 1 with project id to 2
            const updatedLevel1 = await User.findOneAndUpdate(
                { type: "level1", 'projects.projectId': projectId },
                { $set: { 'projects.$.status': 2 } },
                { new: true, useFindAndModify: false }
            );

            if (!updatedLevel1) {
                return res.status(404).send('User level 1 or project not found');
            }

            // Update the project status in the Project database
            project.status = 2;
            await project.save();

            // Send the response with updated user level 2 and level 1
            return res.status(200).json({ updatedUser2, updatedLevel1, project });
        }
    } catch (err) {
        console.error('Error during update:', err);
        res.status(500).send('Internal server error');
    }
});


// well well correct 
// router.put('/level2Accept', async (req, res) => {
//     const projectId = req.body._id;

//     try {
//         // Find user level 2
//         const userLevel2 = await User.findOne({ type: "level2" });
//         if (!userLevel2) {
//             return res.status(404).send('User level 2 not found');
//         }
//         const userId = userLevel2._id;

//         // Delete the project from the level 2 user
//         const updatedUser2 = await User.findByIdAndUpdate(
//             userId,
//             { $pull: { projects: { projectId } } },
//             { new: true, useFindAndModify: false }
//         );

//         if (!updatedUser2) {
//             return res.status(404).send('User level 2 or project not found');
//         }

//         const project = await Project.findById(projectId);
//         if (!project) {
//             return res.status(404).send('Project not found');
//         }

//         // Check the budget and conditionally add to user level 3
//         if (project.budget > 500000) {
//             // Find user level 3
//             const userLevel3 = await User.findOne({ type: "level3" });
//             if (!userLevel3) {
//                 return res.status(404).send('User level 3 not found');
//             }
//             const user3Id = userLevel3._id;

//             // Add the new project to user level 3
//             const updatedUser3 = await User.findByIdAndUpdate(
//                 user3Id,
//                 { $push: { projects: { projectId, status: 0 } } },
//                 { new: true, useFindAndModify: false }
//             );

//             if (!updatedUser3) {
//                 return res.status(404).send('User level 3 not found');
//             }

//             // Send the final response
//             return res.status(200).json({ updatedUser2, updatedUser3 });
//         } else {
//             // Update the status of level 1 with project id to 2
//             const updatedLevel1 = await User.findOneAndUpdate(
//                 { type: "level1", 'projects.projectId': projectId },
//                 { $set: { 'projects.$.status': 2 } },
//                 { new: true, useFindAndModify: false }
//             );

//             if (!updatedLevel1) {
//                 return res.status(404).send('User level 1 or project not found');
//             }

//             // Send the response with updated user level 2 and level 1
//             return res.status(200).json({ updatedUser2, updatedLevel1 });
//         }
//     } catch (err) {
//         console.error('Error during upload:', err);
//         res.status(500).send('Internal server error');
//     }
// });


//working

// router.put('/level2Accept', async (req, res) => {
//     const projectId = req.body._id;

//     try {
//         // Find user level 2
//         const userLevel2 = await User.findOne({ type: "level2" });
//         if (!userLevel2) {
//             return res.status(404).send('User level 2 not found');
//         }
//         const userId = userLevel2._id;

//         // Delete the project from the level 2 user
//         const updatedUser2 = await User.findByIdAndUpdate(
//             userId,
//             { $pull: { projects: { projectId } } },
//             { new: true, useFindAndModify: false }
//         );

//         if (!updatedUser2) {
//             return res.status(404).send('User level 2 or project not found');
//         }

//         const project = await Project.findById(projectId);
//         if (!project) {
//             return res.status(404).send('Project not found');
//         }

//         // Check the budget and conditionally add to user level 3
//         if (project.budget > 400000) {
//             // Find user level 3
//             const userLevel3 = await User.findOne({ type: "level3" });
//             if (!userLevel3) {
//                 return res.status(404).send('User level 3 not found');
//             }
//             const user3Id = userLevel3._id;

//             // Add the new project to user level 3
//             const updatedUser3 = await User.findByIdAndUpdate(
//                 user3Id,
//                 { $push: { projects: { projectId, status: 0 } } },
//                 { new: true, useFindAndModify: false }
//             );

//             if (!updatedUser3) {
//                 return res.status(404).send('User level 3 not found');
//             }

//             // Send the final response
//             return res.status(200).json({ updatedUser2, updatedUser3 });
//         } else {
//             // Send the response with updated user level 2
//             return res.status(200).json({ updatedUser2 });
//         }
//     } catch (err) {
//         console.error('Error during upload:', err);
//         res.status(500).send('Internal server error');
//     }
// });


router.put('/level3Accept', async (req, res) => {
    const projectId = req.body._id;

    try {
        // Find user level 3
        const userLevel3 = await User.findOne({ type: "level3" });
        if (!userLevel3) {
            return res.status(404).send('User level 3 not found');
        }
        const userId = userLevel3._id;

        // Delete the project from the level 3 user
        const updatedUser3 = await User.findByIdAndUpdate(
            userId,
            { $pull: { projects: { projectId } } },
            { new: true, useFindAndModify: false }
        );

        if (!updatedUser3) {
            return res.status(404).send('User level 3 or project not found');
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).send('Project not found');
        }

        // Update the status of level 1 with project id to 2
        const updatedLevel1 = await User.findOneAndUpdate(
            { type: "level1", 'projects.projectId': projectId },
            { $set: { 'projects.$.status': 2 } },
            { new: true, useFindAndModify: false }
        );

        if (!updatedLevel1) {
            return res.status(404).send('User level 1 or project not found');
        }

        // Update the project status in the Project database
        project.status = 2;
        await project.save();

        // Send the response with updated user level 3 and level 1
        return res.status(200).json({ updatedUser3, updatedLevel1, project });

    } catch (err) {
        console.error('Error during update:', err);
        res.status(500).send('Internal server error');
    }
});


//well well working

// router.put('/level3Accept', async (req, res) => {
//     const projectId = req.body._id;

//     try {
//         // Find user level 3
//         const userLevel3 = await User.findOne({ type: "level3" });
//         if (!userLevel3) {
//             return res.status(404).send('User level 3 not found');
//         }
//         const userId = userLevel3._id;

//         // Delete the project from the level 3 user
//         const updatedUser3 = await User.findByIdAndUpdate(
//             userId,
//             { $pull: { projects: { projectId } } },
//             { new: true, useFindAndModify: false }
//         );

//         if (!updatedUser3) {
//             return res.status(404).send('User level 3 or project not found');
//         }

//         // Update the status of level1 with projectId to 2
//         const updatedLevel1 = await User.findOneAndUpdate(
//             { type: "level1", 'projects.projectId': projectId },
//             { $set: { 'projects.$.status': 2 } },
//             { new: true, useFindAndModify: false }
//         );

//         if (!updatedLevel1) {
//             return res.status(404).send('User level 1 or project not found');
//         }

//         // Send the response with updated user level 3 and level 1
//         return res.status(200).json({ updatedUser3, updatedLevel1 });
//     } catch (err) {
//         console.error('Error during upload:', err);
//         res.status(500).send('Internal server error');
//     }
// });


//working
// router.put('/level3Accept', async (req, res) => {
//     const projectId = req.body._id;

//     try {
//         // Find user level 3
//         const userLevel3 = await User.findOne({ type: "level3" });
//         if (!userLevel3) {
//             return res.status(404).send('User level 3 not found');
//         }
//         const userId = userLevel3._id;

//         // Delete the project from the level 3 user
//         const updatedUser3 = await User.findByIdAndUpdate(
//             userId,
//             { $pull: { projects: { projectId } } },
//             { new: true, useFindAndModify: false }
//         );

//         if (!updatedUser3) {
//             return res.status(404).send('User level 3 or project not found');
//         }

//         // Send the response with updated user level 3
//         return res.status(200).json({ updatedUser3 });
//     } catch (err) {
//         console.error('Error during upload:', err);
//         res.status(500).send('Internal server error');
//     }
// });



//working properly
// router.put('/level2Accept', async (req, res) => {
//     const newProject = { projectId: req.body._id, status: 0 };

//     try {
//         // Find user level 1
//         const userLevel2 = await User.findOne({ type: "level2" });
//         if (!userLevel2) {
//             return res.status(404).send('User level 2 not found');
//         }
//         const userId = userLevel2._id;
//         const projectId = req.body._id;

//         // Update the project status for user level 1
//         const updatedUser2 = await User.findOneAndUpdate(
//             { _id: userId, 'projects.projectId': projectId },
//             { $set: { 'projects.$.status': 1 } },
//             { new: true, useFindAndModify: false }
//         );

//         if (!updatedUser2) {
//             return res.status(404).send('User level 1 or project not found');
//         }

//         const project  = await Project.findById(projectId);

  

//             // Find user level 2
//             const userLevel3 = await User.findOne({ type: "level3" });
//             if (!userLevel3) {
//                 return res.status(404).send('User level 3 not found');
//             }
//             const user3Id = userLevel3._id;

//             // Add the new project to user level 2
//             const updatedUser3 = await User.findByIdAndUpdate(
//                 user3Id,
//                 { $push: { projects: newProject } },
//                 { new: true, useFindAndModify: false }
//             );

//             if (!updatedUser3) {
//                 return res.status(404).send('User level 3 not found');
//             }

//             // Send the final response
//             res.status(200).json({ updatedUser2, updatedUser3 });
//     } catch (err) {
//         console.error('Error during upload:', err);
//         res.status(500).send('Internal server error');
//     }
// });

// router.put('/level3Accept', async (req, res) => {

//     try {
//         // Find user level 1
//         const userLevel3 = await User.findOne({ type: "level3" });
//         if (!userLevel3) {
//             return res.status(404).send('User level 2 not found');
//         }
//         const userId = userLevel3._id;
//         const projectId = req.body._id;

//         // Update the project status for user level 1
//         const updatedUser3 = await User.findOneAndUpdate(
//             { _id: userId, 'projects.projectId': projectId },
//             { $set: { 'projects.$.status': 1 } },
//             { new: true, useFindAndModify: false }
//         );

//         if (!updatedUser3) {
//             return res.status(404).send('User level 1 or project not found');
//         }

//         res.status(200).json({ updatedUser3 });
//         }
//         catch (err) {
//         console.error('Error during upload:', err);
//         res.status(500).send('Internal server error');
//     }
// });


// router.put('/managerAccept', async (req,res)=>{
//     try{
//         const newProject = {projectId: req.body._id, status : 0}

//         const user = await User.findOne({type:"level2"});
//         // console.log(req.body._id);
//         const userId = user._id;
//         // console.log(user._id);


//         try {
//             const updatedUser = await User.findByIdAndUpdate(
//                 userId,
//                 { $push: { projects: newProject } },
//                 { new: true, useFindAndModify: false }
//             );
    
//             if (!updatedUser) {
//                 return res.status(404).send('User not found');
//             }
    
//             res.status(200).json(updatedUser);
//         } catch (err) {
//             console.error('Error adding project:', err);
//             res.status(500).send('Internal server error');
//         }

//     }
//     catch(error){
//         console.log(error);
//         res.status(500).send({message:error.message});
//     }
// });

module.exports = router;