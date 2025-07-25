import type { Database, ISteamProfile } from "../../types/index.js";

import mongoose from "mongoose";
import { User, Generation } from "./schemas.js";
import type { IUserModel, IGenerationModel } from "./schemas.js";

const database: Database = {
    connect: async (uri: string) => {
        try {
            await mongoose.connect(uri);
            console.log("Database connected successfully");
        } catch (error) {
            console.error("Database connection error:", error);
            throw error;
        }
    },
    disconnect: async () => {
        try {
            await mongoose.disconnect();
            console.log("Database disconnected successfully");
        } catch (error) {
            console.error("Database disconnection error:", error);
            throw error;
        }
    },
    getUserBySteamId: async (steamId: string): Promise<IUserModel | null> => {
        try {
            const user = await User.findOne({
                steamId: steamId
            });
            return user;
        } catch (error) {
            console.error("Error fetching user by Steam ID:", error);
            throw error;
        }
    },
    createOrUpdateUser: async (userData: ISteamProfile): Promise<IUserModel> => {
        try {
            const user = await User.findOneAndUpdate(
                { steamId: userData.id },
                {
                    steamId: userData.id,
                    ...userData._json
                },
                { upsert: true, new: true }
            );
            return user;
        } catch (error) {
            console.error("Error creating or updating user:", error);
            throw error;
        }
    },
    createGeneration: async (generationData: IGenerationModel): Promise<IGenerationModel> => {
        try {
            const generation = new Generation({
                steamId: generationData.steamId,
                dateTime: generationData.dateTime,
                responseLLM: generationData.responseLLM,
            });
            await generation.save();
            return generation;
        } catch (error) {
            console.error("Error creating generation:", error);
            throw error;
        }
    },
    getGenerationsBySteamId: async (steamId: string): Promise<IGenerationModel[]> => {
        try {
            const generations = await Generation.find({
                steamId: steamId
            });
            return generations;
        } catch (error) {
            console.error("Error fetching generations by Steam ID:", error);
            throw error;
        }
    }
};
export default database;