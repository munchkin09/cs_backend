import type { IUserModel, IGenerationModel, ITeamModel, IProjectModel } from '../controllers/db/schemas.js';
import { ISteamProfile } from './auth.js';

export interface Database {
    connect: (uri: string) => Promise<void>;
    disconnect: () => Promise<void>;
    getUserBySteamId: (steamId: string) => Promise<IUserModel | null>;
    createOrUpdateUser: (userData: ISteamProfile) => Promise<IUserModel>;
    createGeneration: (generationData: IGenerationModel) => Promise<IGenerationModel>;
    getGenerationsBySteamId: (steamId: string) => Promise<IGenerationModel[]>;
}
