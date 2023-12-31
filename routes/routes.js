import express from 'express';
const router = express.Router();
import userControllers from '../controller/logic.js'

import cors from 'cors'
const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
  ],

  allowedHeaders: [
    'Content-Type',
  ],
};

router.use(cors(corsOpts));

router.use(express.json())

// public Routes 

router.post('/emailvarification', userControllers.emailvarification);
router.post('/updateUserDetails', userControllers.updateUserDetails);
router.post('/otpVarification', userControllers.otpVarification);
router.get('/getUserDetails/:id', userControllers.getUserDetails);
router.get('/',userControllers.homepage)
router.get('/allUser', userControllers.alluser);
router.post('/startmassege', userControllers.startmassege);
router.get('/getmsgforuser/:id', userControllers.getmsgforuser)
export default router