import type { Request, Response } from 'express';
import { Team, User } from './db/schemas.js';

// Generates a URL-safe slug from a team name
function toSlug(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

// Finds a unique slug by appending -1, -2, etc. if needed
async function uniqueSlug(base: string): Promise<string> {
    let slug = base;
    let suffix = 0;
    while (await Team.exists({ slug })) {
        suffix += 1;
        slug = `${base}-${suffix}`;
    }
    return slug;
}

function buildTeamController() {
    // POST /api/v1/teams – create a new team for the authenticated user
    const createTeam = async (req: Request, res: Response) => {
        try {
            const steamUser = req.user as any;
            if (!steamUser) {
                res.status(401).json({ error: 'Not authenticated' });
                return;
            }

            const { name, description, slug: requestedSlug } = req.body as {
                name: string;
                description?: string;
                slug?: string;
            };

            if (!name || typeof name !== 'string' || name.trim().length === 0) {
                res.status(400).json({ error: 'Team name is required' });
                return;
            }

            // Look up the user document by steamId
            const user = await User.findOne({ steamId: steamUser.id });
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            // Resolve slug
            const baseSlug = requestedSlug ? toSlug(requestedSlug) : toSlug(name);
            const slug = await uniqueSlug(baseSlug);

            // Create team with the user as owner and admin member
            const team = new Team({
                name: name.trim(),
                slug,
                description: description?.trim(),
                ownerId: user._id,
                members: [{ userId: user._id, role: 'Admin' }],
            });
            await team.save();

            // Add this team to the user's teamIds array
            await User.updateOne({ _id: user._id }, { $addToSet: { teamIds: team._id } });

            res.status(201).json({ team });
        } catch (error) {
            console.error('Error creating team:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    // GET /api/v1/teams – list teams for the authenticated user
    const getMyTeams = async (req: Request, res: Response) => {
        try {
            const steamUser = req.user as any;
            if (!steamUser) {
                res.status(401).json({ error: 'Not authenticated' });
                return;
            }

            const user = await User.findOne({ steamId: steamUser.id });
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            const teams = await Team.find({ _id: { $in: user.teamIds } });
            res.status(200).json({ teams });
        } catch (error) {
            console.error('Error fetching teams:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    return { createTeam, getMyTeams };
}

export default buildTeamController;
