import 'dotenv/config'

import express from 'express'
import path from 'path'
import userRouter from './routes/user.js'
import blogRouter from './routes/blog.js'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import { checkForAuthenticationCookie } from './middlewares/authentication.js'
import { Blog } from './models/blog.js'

mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log("MongoDB connected")
)

const app = express()
const port = process.env.PORT

//middlewares
app.set("view engine", "ejs");
app.set("views", path.resolve('./views') )
app.use(express.json())
app.use(express.urlencoded({extended : false}))
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve("./public")))

//Routers
app.use('/user', userRouter)
app.use('/blog', blogRouter)

app.get('/',async(req,res)=>{
    const allBlogs = await Blog.find({})
    res.render("home",{
        user:req.user,
        blogs:allBlogs,
    });
})



app.listen(port, ()=>{console.log(`Running on port ${port}`);
})