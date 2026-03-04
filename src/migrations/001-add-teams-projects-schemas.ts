/**
 * Migration 001: Add Teams and Projects schemas, update User with teams array
 *
 * This migration:
 * 1. Ensures the Teams collection exists with required indexes
 * 2. Ensures the Projects collection exists with required indexes
 * 3. Adds the `teams` field (default []) to existing User documents that lack it
 *
 * Safe to run multiple times (idempotent).
 */
import mongoose from 'mongoose';
import { User, Team, Project } from '../controllers/db/schemas.js';

export async function up(): Promise<void> {
  console.log('[Migration 001] Starting...');

  // Ensure Teams collection and index exist
  await Team.createIndexes();
  console.log('[Migration 001] Teams indexes ensured.');

  // Ensure Projects collection and indexes exist (unique slug per team)
  await Project.createIndexes();
  console.log('[Migration 001] Projects indexes ensured.');

  // Backfill `teams: []` on existing User documents that don't have it
  const result = await (User as any).updateMany(
    { teams: { $exists: false } },
    { $set: { teams: [] } }
  );
  console.log(`[Migration 001] Updated ${result.modifiedCount} user document(s) with empty teams array.`);

  console.log('[Migration 001] Done.');
}

// Allow running directly: tsx src/migrations/001-add-teams-projects-schemas.ts
if (process.argv[1] && process.argv[1].endsWith('001-add-teams-projects-schemas.ts')) {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cs_ai_analyzer';
  mongoose.connect(uri).then(async () => {
    await up();
    await mongoose.disconnect();
  }).catch((err) => {
    console.error('[Migration 001] Error:', err);
    process.exit(1);
  });
}
