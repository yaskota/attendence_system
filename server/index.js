import express from 'express'
import dotenv from 'dotenv'
import mongodb from './db.js'
import cors from 'cors';
import http from 'http';
import passport from "passport";

import session from "express-session";

import studentrouter from './routers/studentrouter.js'
import cookieParser from 'cookie-parser'
import { POST_ID } from './controllers/teacher_idcontroller.js'
import teacherrouter from './routers/teacherrouter.js'
import classrouter from './routers/classrouter.js'
import attendencerouter from './routers/attendencerouter.js'
import adminrouter from './routers/adminrouter.js';
import { initializeWebSocket } from './ws/websocket.js';
import userAuth from './middleware/userauth.js';
import authrouter from './routers/auth.js';
import './config/passport.js';

const app=express()
dotenv.config()

app.use(cors(
    {
        origin: "http://localhost:3000", // Allow frontend
        credentials: true, // Allow cookies
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
      }
));

app.use(express.json())
app.use(cookieParser())
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/',async(req,res)=>{
    res.status(200).send({message:"server is running"})
})

app.use('/api/authstudent',studentrouter);
app.post('/api/teacher_id',userAuth, POST_ID);
app.use('/api/authteacher',teacherrouter);
app.use('/api/class',classrouter);
app.use('/api/attendence',attendencerouter);
app.use('/api/admin',adminrouter)

app.use('/auth',authrouter)

mongodb();

const server = http.createServer(app);
initializeWebSocket(server);

const port=process.env.PORT || 8080;

server.listen(port,()=>{
    console.log(`Server is running in the Port ${port}`);
})



