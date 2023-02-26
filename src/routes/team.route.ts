import express from 'express';
import { TeamController } from '@/controllers/TeamController';
import { teamPayloadValidation } from '@/middlewares/middleware';


const router = express.Router()

const { CreateTeam, GetSingleTeam, GetTeams, UpdateTeam } = new TeamController();

router.post('/', teamPayloadValidation, CreateTeam);

router.get('/', GetTeams);
router.get('/:teamId', GetSingleTeam);

router.put('/', UpdateTeam);

export default router
