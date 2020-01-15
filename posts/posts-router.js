const express = require('express');

const Posts = require('../data/db.js');

const router = express.Router();

// / = /api/posts -- Get Request

router.get('/', (req,res)=> {
    Posts.find(req.query)
    .then( post => {
        res.status(200).json(post)
    })
    .catch( error => {
        res.status(400).json({
            errorMessage: "Error loading posts."
        })
    })
})

router.get('/:id', (req,res) => {
    const id = req.params.id
    Posts.findById(id)

    .then( post => {

        if(post){
            console.log(post);
            res.status(200).json(post);
        }
        else {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        }
        
    })
    .catch( error => {
        console.log(error);
        res.status(500).json({
            error: "The post information could not be retrieved."
        })
    })
})

router.get('/:id/comments', (req,res)=>{
    const id = req.params.id;
    Posts.findPostComments(id)
    .then( post => {
        if(post){
            res.status(200).json(post);
        } else {
            res.status(404).json({
                message: "The post with the specified ID does not exist."
            })
        }
        
    })
    .catch( error => {
        console.log(error);
        res.status(500).json({
            error: "The comments could not be retrieved"
        })
    })
})

// POST Request

router.post('/', (req,res) => {
    const postData = req.body;
    
    if (postData.title && postData.contents)
    {
        if(typeof postData.title == "string" && typeof postData.contents == "string")
        {
        Posts.insert(postData)
        .then( post => {
            console.log(post);
            res.status(201).json(post);
        })
        .catch( error => {
            console.log(error);
            res.status(500).json({errorMessage: "There was an error while saving the post to the database."})
        })
    }
    } else {
        res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
        })
    }
    })

    //Post request to /api/posts/:id/comments

    router.post('/:id/comments', (req,res) => {
        const id = req.params.id;
        const postData = req.body;
        Posts.findById(id)
        if(id){

         if(postData.text && typeof postData.text == "string")
             {
                Posts.insertComment(postData)
                .then( post => {
                 
                        console.log(post);
                        res.status(201).json(post);
                    
                })
                

            .catch( error =>{
                console.log(error);
                res.status(500).json({
                    error: "There was an error while saving the comment to the database!!."
                })
            })
        } 

        else{
            res.status(400).json({
                errorMessage: "Please provide text for the comment"
            })
        }
        
    }

    else {
        res.status(404).json({
            message: "The post with the specified ID does not exist"
        })
    }
    })

    // Delete /:id 

    router.delete('/:id', (req,res)=>{
        const id = req.params.id;
        
        Posts.remove(id)
        .then(deleted => {
            if(deleted){
                res.status(200).json(deleted);
            } 
            else{
                res.status(404).json({
                    message: "The post with teh specified ID does not exist"
                })
            }
        })
        .catch(error => {
            res.status(500).json({
                error: "The post cannot be removed"
            })
        })
    })

    // PUT Request --- /:id

    router.put('/:id', (req,res)=>{
        const id = req.params.id;
        const body = req.body;

        Posts.update(id, body)
        .then( updated => {
            if(updated){

            if(body.title && body.contents && typeof body.title=="string" && typeof body.contents=="string")
                {

                res.status(200).json(updated);
                }
            else
                {
                    res.status(400).json({
                        errorMessage: "Please provide title and contents for the post"
                    })
                }
            }
            else {
                res.status(404).json({
                    message: "The post with the specified ID does not exist"
                })
            }
        })
        .catch( error =>{
            console.log(error);
            res.status(500).json({
                error: "The post information could not be modified."
            })
        })
        

            
                
                
           
    })
    

module.exports = router;