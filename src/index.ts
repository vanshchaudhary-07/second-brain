import signUpSchema from "./uservalid";
import express from "express";
import bcrypt from "bcrypt";
import { Content, User,main } from "./db";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from "cookie-parser";
import  userMiddleware  from "./middleware";
const app=express();
app.use(express.json());
app.use(cookieParser());

app.post("/api/v1/signup", async (req, res) => {
  const parsed = signUpSchema.safeParse(req.body);

  // 🔴 validation error
  if (!parsed.success) {
    return res.status(411).json({"message":"error in input","error":parsed.error.issues});
  }

  try {
    const { username, password } = parsed.data;

    // 🔴 user exists
    const exist = await User.findOne({ username });
    if (exist) {
      return res.status(403).send("user already exists");
    }

    // 🔐 hash password
    const hashPass = await bcrypt.hash(password, 10);

    await User.create({
      username,
      password: hashPass
    });

    // ✅ success
    return res.status(200).send("signup done");

  } catch (err) {
    console.error(err);
    return res.status(500).send("internal server error");
  }
});

app.post("/api/v1/signin", async(req,res)=>{
    try{
        const exist = await User.findOne({ username: req.body.username });
        if (!exist) {
            return res.status(404).send("user doesn't exists");
        }
        const ans = await bcrypt.compare(req.body.password,exist.password);
        if (!ans) {
            return res.status(403).send("wrong password entered");
        }
        const token=jwt.sign({_id:exist._id,username:exist.username},"vansh@123",{expiresIn:3000000});
        res.cookie("token",token);
        res.status(200).send("signup succesful");
    }
    catch(err){
        return res.send("db failed")
    }
})

app.post("/api/v1/content",userMiddleware,async(req,res)=>{
    try{
      await Content.create({
        type: req.body.type,
        link: req.body.link, 
        title: req.body.title, 
        userId: req.userId
      });
      res.status(200).send("succesfully created");
    }
    catch(err){
      res.send(err);
    }
});

app.get("/api/v1/content",userMiddleware,async(req,res)=>{
  try{
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result=await Content.find({
      userId:req.userId
    }).populate("userId","username");
    res.json(result);
  }
  catch(err){
    res.status(404).json({message:"unauthorized access"});
  }
})

main()
.then(()=>{
    console.log("db connected");
    app.listen(4000,()=>console.log("server connected"));})
    .catch((err)=>{
    console.log("error:"+err);
});