import express from 'express';

// Route: ('/api/seminar/participants')
const router = express.Router();

import parseToken from '../../../Middlewares/JWT/parseToken.js';
router.use(parseToken);


//? ========================================= ROUTES =============================================== ?//



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