import express from 'express'
import { attend, attendencefilter, completed, Delete,  getattendToday, rollFilter } from '../controllers/attendencecontroll.js'
import userAuth from '../middleware/userauth.js';

const attendencerouter=express.Router()

attendencerouter.post('/attend',userAuth, attend);
attendencerouter.post('/getdata',userAuth,getattendToday);
attendencerouter.post('/delete/:id',userAuth,Delete);
attendencerouter.post('/complete',userAuth,completed)
attendencerouter.post('/rollfilter',userAuth,rollFilter);
attendencerouter.post('/attendencefilter',userAuth,attendencefilter);

export default attendencerouter;


