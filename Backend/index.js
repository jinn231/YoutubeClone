require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose")
const AuthRoute = require("./routes/auth")
const UserRoute = require("./routes/user")
const VideoRoute = require("./routes/video")
const CommentRoute = require("./routes/comment")
const cookieParser = require("cookie-parser")
const cors = require("cors");
const path = require("path");
const multer = require("multer")

const corsOptions = {
    credentials: true,
    origin: "https://youtube-clonebyjinn.netlify.app",
    methods: ['GET','POST','PUT','DELETE']
}

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://youtube-clonebyjinn.netlify.app")
    res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, PATCH, DELETE, OPTION")
    res.setHeader("Access-Control-Allow-Headers", 'Content-Type, Authorization')
    next()
})

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /mp4|avi|mov/; // Regular expression for allowed file extensions
    const extname = allowedFileTypes.test(file.originalname.toLowerCase().split('.').pop());
    const mimetype = allowedFileTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Only .mp4, .avi, and .mov files are allowed')); // Reject the file
    }
  }



app.use(cors(corsOptions))
// Set the directory for serving static files
// app.use('/videos', express.static(path.join(__dirname, "videos")));  
app.use(cookieParser())
app.use(express.json())
app.use(multer({ storage: multer.diskStorage({}), fileFilter: fileFilter }).single("file"))

// Routers
app.use("/api/auth", AuthRoute)
app.use("/api/user", UserRoute)
app.use("/api/videos", VideoRoute)
app.use("/api/cmts", CommentRoute)

app.use((error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message || "Internal Server Error!";
    res.status(status).json({
        statusCode: status,
        message: message
    })
})

mongoose.connect(process.env.MONGOURL)
.then((db) => {
    app.listen(8080)
})
.catch(err => {
    console.log(err)
})
