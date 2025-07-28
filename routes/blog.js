import { Router } from "express"
import { Blog } from "../models/blog.js"
import { Comment } from "../models/comment.js"
import path from 'path'
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from "multer"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    allowed_formats: ['jpg', 'png', 'jpeg']
  }
});

const upload = multer({ storage: storage })

const router = Router()

router.get('/addblog', (req, res) => {
    res.render("addblog",
        {
            user:req.user
        }
    )
})

router.get('/:id', async(req, res)=>{
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({blogId: req.params.id}).populate("createdBy")
  return res.render('blog', {
    user : req.user,
    blog,
    comment: comments,
  })
})

router.post('/comment/:blogId',async(req, res)=>{
  await Comment.create({
    content : req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  })

  return res.redirect(`/blog/${req.params.blogId}`)
})


router.post('/', upload.single('coverImage') ,async(req, res) => {
    const {title, body} = req.body
    const blog = await Blog.create({
        title:title,
        body:body,
        createdBy:req.user._id,
        coverImageURL:req.file.path
    })
    return res.redirect(`/blog/${blog._id}`)
})

export default router