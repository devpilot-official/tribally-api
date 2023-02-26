import express from 'express';
import { MatchupController } from '@/controllers/MatchupController';
import { payloadValidation, statusValidation } from '@/middlewares/middleware';


const router = express.Router()

const { CreateMatchup, GetGames, GetSingleGame, UpdateMatchStatus, UpdateScore } = new MatchupController();

router.get('/', GetGames);
router.get('/:gameId', GetSingleGame);

router.post('/', payloadValidation, CreateMatchup);

router.put('/status', statusValidation, UpdateMatchStatus);
router.put('/score/:gameId', UpdateScore);

export default router
