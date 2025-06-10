import type { IUser, IGeneration } from '../controllers/db/schemas';
import { ISteamProfile } from './auth';

export interface Database {
    connect: (uri: string) => Promise<void>;
    disconnect: () => Promise<void>;
    getUserBySteamId: (steamId: string) => Promise<IUser | null>;
    createOrUpdateUser: (userData: ISteamProfile) => Promise<IUser>;
    createGeneration: (generationData: IGeneration) => Promise<IGeneration>;
    getGenerationsBySteamId: (steamId: string) => Promise<IGeneration[]>;
}
