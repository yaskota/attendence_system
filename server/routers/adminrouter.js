import express from 'express';
import { login } from '../controllers/admincontroller.js';

const adminrouter=express.Router()

adminrouter.post('/login',login);

export default adminrouter