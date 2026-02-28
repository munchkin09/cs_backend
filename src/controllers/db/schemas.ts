import mongoose, { Schema, Types } from 'mongoose';

// Define the schema for the User model
export interface IUserModel extends Document {
  steamId: string;
  displayName: string;
  profileUrl: string;
  avatarUrl: string;
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
  // US-001: Team associations – array of team IDs the user belongs to
  teamIds: Types.ObjectId[];
}

export interface IGenerationModel extends Document {
  steamId: string;
  dateTime: string;
  responseLLM: string;
}

// US-001: Team member entry with role for ACL
export interface ITeamMember {
  userId: Types.ObjectId;
  role: 'Admin' | 'Editor' | 'Viewer';
}

// US-001: Team model – owns projects and has members
export interface ITeamModel extends Document {
  name: string;
  slug: string;
  description?: string;
  ownerId: Types.ObjectId;
  members: ITeamMember[];
}

// US-001: Project model – belongs to a team
export interface IProjectModel extends Document {
  name: string;
  teamId: Types.ObjectId;
  ticketSlug: string;
  statusOptions: string[];
}

const userSchema = new Schema({
    steamId: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    profileUrl: { type: String, required: true },
    avatarUrl: { type: String, required: false },
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
    locstatecode: { type: String, required: false },
    // US-001: array of team ObjectIds for fast membership lookups
    teamIds: [{ type: Schema.Types.ObjectId, ref: 'Teams', default: [] }],
}, {
    timestamps: true,
});

const generationSchema = new Schema({
    steamId: { type: String, required: true },
    dateTime: { type: Date, default: Date.now },
    responseLLM: { type: String, required: true },
}, {
    timestamps: true,
});

// US-001: Team schema – index on slug for fast lookups
const teamSchema = new Schema<ITeamModel>({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    ownerId: { type: Schema.Types.ObjectId, ref: 'Users', required: true, index: true },
    members: [{
        userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
        role: { type: String, enum: ['Admin', 'Editor', 'Viewer'], default: 'Viewer' },
    }],
}, {
    timestamps: true,
});

// US-001: Project schema – index on teamId for fast ACL queries
const projectSchema = new Schema<IProjectModel>({
    name: { type: String, required: true },
    teamId: { type: Schema.Types.ObjectId, ref: 'Teams', required: true, index: true },
    ticketSlug: { type: String, required: true, unique: true },
    statusOptions: { type: [String], default: ['Backlog', 'Todo', 'In Progress', 'Done'] },
}, {
    timestamps: true,
});

export const User = mongoose.model<IUserModel>('Users', userSchema);
export const Generation = mongoose.model<IGenerationModel>('Generations', generationSchema);
export const Team = mongoose.model<ITeamModel>('Teams', teamSchema);
export const Project = mongoose.model<IProjectModel>('Projects', projectSchema);

