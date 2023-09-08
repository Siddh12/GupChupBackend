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
router.get('/getUserDetails', userControllers.getUserDetails);

export default router