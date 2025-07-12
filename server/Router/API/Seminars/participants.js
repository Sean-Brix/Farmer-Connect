import express from 'express';

// Route: ('/api/seminar/participants')
const router = express.Router();

import parseToken from '../../../Middlewares/JWT/parseToken.js';
router.use(parseToken);


//? ========================================= ROUTES =============================================== ?//

import applySeminar from '../../../Controller/Seminar/applySeminar.js';
router.post('/apply/:id', applySeminar);

import getUserRegistration from '../../../Controller/Seminar/getUserRegistration.js';
router.get('/user', getUserRegistration);

import cancelUserRegistration from '../../../Controller/Seminar/cancelUserRegistration.js';
router.post('/cancel/:id', cancelUserRegistration);

//? ================================================================================================ ?//

//? ======================================= AUTHORIZED ============================================= ?//

// Authorization middleware
import authorize from '../../../Middlewares/Auth/authorize.js';
router.use(authorize);

// Participants
import getParticipants from '../../../Controller/Seminar/getParticipants.js';
router.get('/:id', getParticipants)

// Update
import updateParticipant from '../../../Controller/Seminar/updateParticipant.js';
router.post('/update/:id', updateParticipant);

//? ================================================================================================ ?//

export default router;