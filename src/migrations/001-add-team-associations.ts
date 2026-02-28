/**
 * US-001: Migration – add team association fields to existing collections.
 *
 * Run with:
 *   npx tsx src/migrations/001-add-team-associations.ts
 *
 * Safe to run multiple times (idempotent via $setOnInsert / default values).
 */
import mongoose from 'mongoose';

const MONGO_URI =
  process.env.AZURE_COSMOS_CONNECTIONSTRING ||
  process.env.DATABASE_URL ||
  'mongodb://localhost:27017/cs_ai_analyzer';

async function runMigration(): Promise<void> {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB:', MONGO_URI);

  const db = mongoose.connection.db;
  if (!db) throw new Error('Database connection not available');

  // 1. Add teamIds array (default []) to all Users that lack the field
  const usersResult = await db.collection('users').updateMany(
    { teamIds: { $exists: false } },
    { $set: { teamIds: [] } }
  );
  console.log(`Users updated: ${usersResult.modifiedCount}`);

  // 2. Ensure indexes on Users.teamIds for fast team-membership queries
  await db.collection('users').createIndex({ teamIds: 1 }, { background: true });
  console.log('Index on users.teamIds ensured');

  // 3. Ensure Teams collection exists with required indexes
  const teamsColl = await db
    .listCollections({ name: 'teams' })
    .toArray();
  if (teamsColl.length === 0) {
    await db.createCollection('teams');
    console.log('Created teams collection');
  }
  await db.collection('teams').createIndex({ slug: 1 }, { unique: true, background: true });
  await db.collection('teams').createIndex({ ownerId: 1 }, { background: true });
  await db.collection('teams').createIndex({ 'members.userId': 1 }, { background: true });
  console.log('Indexes on teams collection ensured');

  // 4. Ensure Projects collection exists with required indexes
  const projectsColl = await db
    .listCollections({ name: 'projects' })
    .toArray();
  if (projectsColl.length === 0) {
    await db.createCollection('projects');
    console.log('Created projects collection');
  }
  await db.collection('projects').createIndex({ teamId: 1 }, { background: true });
  await db
    .collection('projects')
    .createIndex({ ticketSlug: 1 }, { unique: true, background: true });
  console.log('Indexes on projects collection ensured');

  await mongoose.disconnect();
  console.log('Migration 001 completed successfully.');
}

runMigration().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
