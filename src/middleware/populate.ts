/**
 * US-001: Middleware to populate MongoDB associations.
 * Attaches populated data to requests so route handlers don't repeat queries.
 */
import type { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Project } from '../controllers/db/schemas.js';

/**
 * Populates a project document with its team members using MongoDB $lookup.
 * Attaches the result to req.populatedProject.
 *
 * Usage: router.get('/projects/:projectId', populateProject, handler)
 */
export async function populateProject(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { projectId } = req.params;

  if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ error: 'Invalid project ID' });
    return;
  }

  try {
    // Use $lookup to join project -> team -> members (users) in a single query
    const results = await Project.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(projectId) } },
      {
        $lookup: {
          from: 'teams',
          localField: 'teamId',
          foreignField: '_id',
          as: 'team',
        },
      },
      { $unwind: { path: '$team', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'users',
          localField: 'team.members.userId',
          foreignField: '_id',
          as: 'teamMembers',
          pipeline: [{ $project: { steamId: 1, displayName: 1, avatarUrl: 1 } }],
        },
      },
    ]);

    if (!results.length) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    (req as any).populatedProject = results[0];
    next();
  } catch (err) {
    next(err);
  }
}
