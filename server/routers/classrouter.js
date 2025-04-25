import express from 'express'
import { create, Delete, gather, Update } from '../controllers/classcontroll.js'
import userAuth from '../middleware/userauth.js';

const classrouter=express.Router()

classrouter.post('/create', userAuth, create);
classrouter.get('/gather',userAuth,gather);
classrouter.delete('/delete/:id',Delete);
classrouter.patch('/update/:id',Update);

export default classrouter;
