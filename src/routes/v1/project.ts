import express from 'express';
import buildProjectController from '../../controllers/project.js';

function buildProjectRouter() {
    const router = express.Router();
    const { createProject, getTeamProjects, getProject } = buildProjectController();

    // Create a new project linked to a team
    router.post('/', createProject);

    // Get a single project by ID (ACL enforced in controller)
    router.get('/:projectId', getProject);

    // List projects for a specific team
    router.get('/team/:teamId', getTeamProjects);

    return router;
}

export default buildProjectRouter;
