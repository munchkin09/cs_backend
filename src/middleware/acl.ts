/**
 * US-001: ACL middleware for team-based access control.
 * Ensures that only team members can access team-gated resources.
 */
import type { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Project, Team } from '../controllers/db/schemas.js';

/**
 * Express middleware that verifies the authenticated user belongs to the team
 * associated with the requested project (resolved from req.params.projectId).
 *
 * Usage: router.get('/projects/:projectId/...', requireTeamMembership, handler)
 */
export async function requireTeamMembership(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const user = req.user as { _id?: string; steamId?: string } | undefined;

  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { projectId, teamId } = req.params;

  try {
    let resolvedTeamId: string | undefined = teamId;

    // If we have a projectId, resolve the teamId from the project
    if (projectId && !resolvedTeamId) {
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        res.status(400).json({ error: 'Invalid project ID' });
        return;
      }
      const project = await Project.findById(projectId).select('teamId').lean();
      if (!project) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }
      resolvedTeamId = project.teamId.toString();
    }

    if (!resolvedTeamId) {
      res.status(400).json({ error: 'Team or project ID required' });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(resolvedTeamId)) {
      res.status(400).json({ error: 'Invalid team ID' });
      return;
    }

    // Look up the team and check membership
    const team = await Team.findById(resolvedTeamId)
      .select('ownerId members')
      .lean();

    if (!team) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }

    const userId = (user as any)._id?.toString() ?? (user as any).id?.toString();

    const isOwner = team.ownerId.toString() === userId;
    const isMember = team.members.some((m) => m.userId.toString() === userId);

    if (!isOwner && !isMember) {
      res.status(403).json({ error: 'Forbidden: not a team member' });
      return;
    }

    // Attach team to request for downstream handlers
    (req as any).team = team;
    next();
  } catch (err) {
    next(err);
  }
}
