import mongoose from "mongoose"

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    body:{
        type:String,
        required:true,
    },
    coverImageURL:{
        type:String,
        required: false
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectID,
        ref:'user'
    },

}, {timestamps: true})

export const Blog = mongoose.model("blog", blogSchema)