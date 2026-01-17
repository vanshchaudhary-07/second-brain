import mongoose, { Schema, Types } from "mongoose";
import { required } from "zod/mini";
async function main(){
    await mongoose.connect(process.env.DB_KEY);
}

 const userSchema= new Schema({
    username:{type:String , required:true},password:{type:String , required:true}
});

let contentTypes=['document','tweet','youtube','link'];
const contentSchema=new Schema({
    link:{type:String,required:true},
    type:{type:String,enum:contentTypes,required:true},
    title:{type:String,required:true},
    userId:{type:Types.ObjectId,ref:'user',required:true},
    tags:{types:Types.ObjectId}
})

const Content=mongoose.model("content",contentSchema);
const User=mongoose.model("user",userSchema);
export {User,main,Content};