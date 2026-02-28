import express from 'express';
import buildTeamController from '../../controllers/team.js';

function buildTeamRouter() {
    const router = express.Router();
    const { createTeam, getMyTeams } = buildTeamController();

    // List teams for the authenticated user
    router.get('/', getMyTeams);

    // Create a new team
    router.post('/', createTeam);

    return router;
}

export default buildTeamRouter;
