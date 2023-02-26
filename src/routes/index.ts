import express from 'express'
import team from './team.route'
import matchup from './matchup.route'

const router = express.Router();

router.use('/team', team);
router.use('/matchup', matchup);


export default router
