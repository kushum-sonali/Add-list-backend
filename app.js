const express=require('express');
const cors=require('cors');
const session=require('express-session');
const bodyParser=require('body-parser');
const passport=require('passport');
const path=require('path');
const bcrypt= require("bcrypt");
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const app=express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
require("./mongoose")
const User=require("./modal/user");
app.post("/signup",async(req,res,next)=>{
    try{
        const {username,email,password}=req.body;
        console.log(req.body);
        if(!username || !email || !password){
            return res.status(422).json({error:"please fill all the fields"});
        }
        const saltRounds=10;
        const hashPassword=await bcrypt.hash(password,saltRounds);
        const newuser=new User({
            username,
            email,
            password:hashPassword
        })
        const result = await  newuser.save();
        res.status(201).json({message:"user registered successfully",result});

    }catch(err){
        console.log(err);

    }
})
app.post("/login",async(req,res,next)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(422).json({error:"please fill all the fields"});
        }
        const userfind= await User.findOne({email})
        if(!userfind){
            return res.status(422).json({error:"email or password is incorrect"});
        }
        
        const isMatch=await bcrypt.compare(password,userfind.password);
        const token= await jwt.sign({
            name:userfind.username,
            email:userfind.email,

        },"privetkey",{expiresIn:"1h"});
        if(isMatch){
            res.status(201).json({message:"user logged in successfully",token});
        }
        else{
            res.status(422).json({error:"invalid credentials"});
        }

    }
    catch(err){
        console.log(err);
    }   
})
app.post("/addtodo",async(req,res,next)=>{
    try{
        const {title,description,date,time,status,priority}=req.body;
        console.log(req.body);
        if(!title || !description || !date || !time || !status || !priority){
            return res.status(422).json({error:"please fill all the fields"});
        }
        const newtodo=new User({
            title,
            description,
            date,
            time,
            status,
            priority
        })
        const result = await  newtodo.save();
        res.status(201).json({message:"todo added successfully",result});

    }catch(err){
        console.log(err);

    }
})

app.listen(port,()=>{
    console.log(`server is running at port no ${port}`);
})
