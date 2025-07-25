import mongoose from "mongoose"
import {createHmac, randomBytes} from 'node:crypto'
import { createTokenForUser } from "../services/auth.js";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    profileImageUrl:{
        type:String,
        default:'/images/default.jpg',
    },
    role:{
        type:String,
        enum:["USER", "ADMIN"],
        default:"USER",
    }
}, {timestamps : true})

userSchema.pre('save', function (next){
    const user = this;

    if(!user.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest('hex')
    
    this.salt = salt
    this.password = hashedPassword

    next();
})

userSchema.static("matchPasswordAndCreateToken", async function(email, password){
    const user = await this.findOne({email})

    if(!user) throw new Error('User not Found.')

    const salt = user.salt
    const hashedPassword = user.password

    const userProvidedPassword = createHmac("sha256", salt)
    .update(password)
    .digest('hex')

    if(userProvidedPassword !== hashedPassword) throw new Error("Incorrect Password.")
    
    const token = createTokenForUser(user)

    return token    
})

export const User = mongoose.model('user', userSchema)

