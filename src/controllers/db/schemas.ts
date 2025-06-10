import mongoose, { Schema } from 'mongoose';

// Define the schema for the User model
export interface IUser extends Document {
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
}

export interface IGeneration extends Document {
  steamId: string;
  dateTime: string;
  responseLLM: string;
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
    locstatecode: { type: String, required: false }
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

export const User = mongoose.model<IUser>('Users', userSchema);
export const Generation = mongoose.model<IGeneration>('Generations', generationSchema);

