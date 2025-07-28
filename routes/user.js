import { Router } from "express";
import { User } from "../models/user.js";

const router = Router()

router.get('/signin',(req, res)=>{
    res.render("signin")
})

router.get('/signup',(req, res)=>{
    res.render("signup")
})

router.post("/signin", async(req, res)=>{
    const {email, password} = req.body;

    try {
        const token = await User.matchPasswordAndCreateToken(email, password)        
        return res.cookie("token",token,{
      maxAge: 30 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
        }).redirect('/')
    } catch (error) {
        res.render('signin',{
            error:"Incorrect email or pasword"
        })
    }
})

router.post('/signup', async(req, res) => {
    const {name, email, password} = req.body;
    await User.create({
        name:name,
        email:email,
        password:password,
    })

    return res.redirect('/')
})

router.get('/logout',(req,res)=>{
    return res.clearCookie("token").redirect('/')
})

export default router;