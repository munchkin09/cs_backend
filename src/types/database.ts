import type { IUserModel, IGenerationModel } from '../controllers/db/schemas';
import { ISteamProfile } from './auth';

export interface Database {
    connect: (uri: string, databaseName: string) => Promise<void>;
    disconnect: () => Promise<void>;
    getUserBySteamId: (steamId: string) => Promise<IUserModel | null>;
    createOrUpdateUser: (userData: ISteamProfile) => Promise<IUserModel>;
    createGeneration: (generationData: IGenerationModel) => Promise<IGenerationModel>;
    getGenerationsBySteamId: (steamId: string) => Promise<IGenerationModel[]>;
}
