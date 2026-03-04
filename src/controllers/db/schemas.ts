import mongoose, { Schema, Types } from 'mongoose';

// ─── Team membership entry ───────────────────────────────────────────────────

export interface ITeamMembership {
  teamId: Types.ObjectId;
  role: string;
}

// ─── User model ──────────────────────────────────────────────────────────────

export interface IUserModel extends Document {
  steamId: string;
  displayName: string;
  profileUrl: string;
  avatarUrl: string;
  teams: ITeamMembership[];
  communityvisibilitystate?: number;
  profilestate?: number;
  personaname?: string;
  commentpermission?: number;
  profileurl?: string;
  avatar?: string;
  avatarmedium?: string;
  avatarfull?: string;
  avatarhash?: string;
  lastlogoff?: number;
  personastate?: number;
  realname?: string;
  primaryclanid?: string;
  timecreated?: number;
  personastateflags?: number;
  loccountrycode?: string;
  locstatecode?: string;
}

// ─── Team model ───────────────────────────────────────────────────────────────

export interface ITeamModel extends Document {
  name: string;
  description?: string;
  ownerId: Types.ObjectId;
  members: Array<{ userId: Types.ObjectId; role: string }>;
  projects: Types.ObjectId[];
  active: boolean;
}

// ─── Project model ────────────────────────────────────────────────────────────

export interface IProjectModel extends Document {
  name: string;
  teamId: Types.ObjectId;
  slug: string;
  statusCategories: string[];
  active: boolean;
}

// ─── Generation model ─────────────────────────────────────────────────────────

export interface IGenerationModel extends Document {
  steamId: string;
  dateTime: string;
  responseLLM: string;
}

// ─── Schemas ──────────────────────────────────────────────────────────────────

const teamMembershipSchema = new Schema({
  teamId: { type: Schema.Types.ObjectId, ref: 'Teams', required: true },
  role: { type: String, required: true, default: 'viewer' },
}, { _id: false });

const userSchema = new Schema({
    steamId: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    profileUrl: { type: String, required: true },
    avatarUrl: { type: String, required: false },
    teams: { type: [teamMembershipSchema], default: [] },
    communityvisibilitystate: { type: Number, required: false },
    profilestate: { type: Number, required: false },
    personaname: { type: String, required: false },
    commentpermission: { type: Number, required: false },
    profileurl: { type: String, required: false },
    avatar: { type: String, required: false },
    avatarmedium: { type: String, required: false },
    avatarfull: { type: String, required: false },
    avatarhash: { type: String, required: false },
    lastlogoff: { type: Number, required: false },
    personastate: { type: Number, required: false },
    realname: { type: String, required: false },
    primaryclanid: { type: String, required: false },
    timecreated: { type: Number, required: false },
    personastateflags: { type: Number, required: false },
    loccountrycode: { type: String, required: false },
    locstatecode: { type: String, required: false }
}, {
    timestamps: true,
});

const teamMemberSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  role: { type: String, required: true, default: 'viewer' },
}, { _id: false });

const teamSchema = new Schema({
    name: { type: String, required: true, maxlength: 100 },
    description: { type: String, required: false, maxlength: 500 },
    ownerId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    members: { type: [teamMemberSchema], default: [] },
    projects: [{ type: Schema.Types.ObjectId, ref: 'Projects' }],
    active: { type: Boolean, default: true },
}, {
    timestamps: true,
});

const projectSchema = new Schema({
    name: { type: String, required: true },
    teamId: { type: Schema.Types.ObjectId, ref: 'Teams', required: true },
    slug: { type: String, required: true },
    statusCategories: { type: [String], default: ['Backlog', 'Todo', 'In Progress', 'Done'] },
    active: { type: Boolean, default: true },
}, {
    timestamps: true,
});

// Unique slug per team
projectSchema.index({ teamId: 1, slug: 1 }, { unique: true });

const generationSchema = new Schema({
    steamId: { type: String, required: true },
    dateTime: { type: Date, default: Date.now },
    responseLLM: { type: String, required: true },
}, {
    timestamps: true,
});

export const User = mongoose.model<IUserModel>('Users', userSchema);
export const Team = mongoose.model<ITeamModel>('Teams', teamSchema);
export const Project = mongoose.model<IProjectModel>('Projects', projectSchema);
export const Generation = mongoose.model<IGenerationModel>('Generations', generationSchema);

