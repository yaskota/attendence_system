import express from 'express'
import { attend, attendencefilter, completed, Delete,  getattendToday, rollFilter } from '../controllers/attendencecontroll.js'
import userAuth from '../middleware/userauth.js';

const attendencerouter=express.Router()

attendencerouter.post('/attend',userAuth, attend);
attendencerouter.post('/getdata',getattendToday);
attendencerouter.post('/delete/:id',Delete);
attendencerouter.post('/complete',completed)
attendencerouter.post('/rollfilter',rollFilter);
attendencerouter.post('/attendencefilter',attendencefilter);

export default attendencerouter;


