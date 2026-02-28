import type { Request, Response } from 'express';
import { Project, Team, User } from './db/schemas.js';

// Validates ticket slug format: 3-4 uppercase letters followed by a hyphen (e.g., "TKT-")
function isValidTicketSlug(slug: string): boolean {
    return /^[A-Z]{3,4}-$/.test(slug);
}

function buildProjectController() {
    // POST /api/v1/projects – create a new project linked to a team
    const createProject = async (req: Request, res: Response) => {
        try {
            const steamUser = req.user as any;
            if (!steamUser) {
                res.status(401).json({ error: 'Not authenticated' });
                return;
            }

            const { name, teamId, ticketSlug } = req.body as {
                name: string;
                teamId: string;
                ticketSlug: string;
            };

            if (!name || typeof name !== 'string' || name.trim().length === 0) {
                res.status(400).json({ error: 'Project name is required' });
                return;
            }

            if (!teamId || typeof teamId !== 'string') {
                res.status(400).json({ error: 'teamId is required' });
                return;
            }

            if (!ticketSlug || !isValidTicketSlug(ticketSlug)) {
                res.status(400).json({
                    error: 'ticketSlug must be 3-4 uppercase letters followed by a hyphen (e.g., "TKT-")',
                });
                return;
            }

            // Verify the team exists
            const team = await Team.findById(teamId);
            if (!team) {
                res.status(404).json({ error: 'Team not found' });
                return;
            }

            // Verify the requesting user is a member of the team
            const user = await User.findOne({ steamId: steamUser.id });
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            const isMember = team.members.some(
                (m) => m.userId.toString() === (user._id as any).toString()
            );
            const isOwner = team.ownerId.toString() === (user._id as any).toString();

            if (!isMember && !isOwner) {
                res.status(403).json({ error: 'Forbidden: you must be a team member to create a project' });
                return;
            }

            // Ensure ticketSlug is unique
            const existing = await Project.findOne({ ticketSlug });
            if (existing) {
                res.status(409).json({ error: `Ticket slug "${ticketSlug}" is already in use` });
                return;
            }

            const project = new Project({
                name: name.trim(),
                teamId: team._id,
                ticketSlug,
                statusOptions: ['Backlog', 'Todo', 'In Progress', 'Done'],
            });
            await project.save();

            // Generate the first example ticket ID for display
            const prefix = ticketSlug; // e.g., "TKT-"
            const firstTicketExample = `${prefix}001`;

            res.status(201).json({ project, firstTicketExample });
        } catch (error) {
            console.error('Error creating project:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    // GET /api/v1/teams/:teamId/projects – list projects for a team (team members only)
    const getTeamProjects = async (req: Request, res: Response) => {
        try {
            const steamUser = req.user as any;
            if (!steamUser) {
                res.status(401).json({ error: 'Not authenticated' });
                return;
            }

            const { teamId } = req.params;

            const team = await Team.findById(teamId);
            if (!team) {
                res.status(404).json({ error: 'Team not found' });
                return;
            }

            const user = await User.findOne({ steamId: steamUser.id });
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            const isMember = team.members.some(
                (m) => m.userId.toString() === (user._id as any).toString()
            );
            const isOwner = team.ownerId.toString() === (user._id as any).toString();

            if (!isMember && !isOwner) {
                res.status(403).json({ error: 'Forbidden: not a team member' });
                return;
            }

            const projects = await Project.find({ teamId: team._id });
            res.status(200).json({ projects });
        } catch (error) {
            console.error('Error fetching projects:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    // GET /api/v1/projects/:projectId – get a single project (team members only)
    const getProject = async (req: Request, res: Response) => {
        try {
            const steamUser = req.user as any;
            if (!steamUser) {
                res.status(401).json({ error: 'Not authenticated' });
                return;
            }

            const { projectId } = req.params;

            const project = await Project.findById(projectId);
            if (!project) {
                res.status(404).json({ error: 'Project not found' });
                return;
            }

            const team = await Team.findById(project.teamId);
            if (!team) {
                res.status(404).json({ error: 'Team not found' });
                return;
            }

            const user = await User.findOne({ steamId: steamUser.id });
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            const isMember = team.members.some(
                (m) => m.userId.toString() === (user._id as any).toString()
            );
            const isOwner = team.ownerId.toString() === (user._id as any).toString();

            if (!isMember && !isOwner) {
                res.status(403).json({ error: 'Forbidden: not a team member' });
                return;
            }

            const prefix = project.ticketSlug;
            const firstTicketExample = `${prefix}001`;

            res.status(200).json({ project, firstTicketExample });
        } catch (error) {
            console.error('Error fetching project:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    return { createProject, getTeamProjects, getProject };
}

export default buildProjectController;
