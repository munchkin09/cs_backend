import type { IUser, IGeneration } from '../controllers/db/schemas';

export interface Database {
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    getUserBySteamId: (steamId: string) => Promise<IUser | null>;
    createUser: (userData: IUser) => Promise<IUser>;
    updateUser: (steamId: string, userData: Partial<IUser>) => Promise<IUser | null>;
    createGeneration: (generationData: IGeneration) => Promise<IGeneration>;
    getGenerationsBySteamId: (steamId: string) => Promise<IGeneration[]>;
}
