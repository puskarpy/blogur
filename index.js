import express from 'express'
import path from 'path'
import userRouter from './routes/user.js'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import { checkForAuthenticationCookie } from './middlewares/authentication.js'

mongoose.connect("mongodb://127.0.0.1:27017/blogur")
.then(()=> console.log("MongoDB connected")
)

const app = express()
const port = 8000

//middlewares
app.set("view engine", "ejs");
app.set("views", path.resolve('./views') )
app.use(express.json())
app.use(express.urlencoded({extended : false}))
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"))

//Routers
app.use('/user', userRouter)

app.get('/',(req,res)=>{
    res.render("home",{
        user:req.user
    });
})



app.listen(port, ()=>{console.log(`Running on port ${port}`);
})