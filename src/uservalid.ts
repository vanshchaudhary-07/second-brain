import {z} from "zod";

const signUpSchema=z.object({
    username: z.string().min(3,"username should contain atleast 3 letters").
    max(10,"userame must be atmost 10 characters").
    regex(/^[a-zA-Z]+$/,"invalid input"),

    password: z.string().min(8,"password must be atleast 8 characters").
    max(20,"password should have maximum 20 characters").regex(/[a-z]/,"password must contain lowercase letters").
    regex(/[A-Z]/,"password must contain uppercase letters").regex(/\d/,"must contain a number").
    regex(/[@^*!?_]/,"doesn't contain special character")
});

export default signUpSchema;