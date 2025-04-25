import express from 'express'
import { attend, Delete, getattend } from '../controllers/attendencecontroll.js'
import userAuth from '../middleware/userauth.js';

const attendencerouter=express.Router()

attendencerouter.post('/attend',userAuth, attend);
attendencerouter.get('/getdata',getattend);
attendencerouter.delete('/delete/:id',Delete);

export default attendencerouter;


