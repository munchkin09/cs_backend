
export interface IGeneration {
    pathToVideo: string;
}

export interface IGenerationController {
    createGeneration(data: IGeneration): Promise<string>;
    getGenerationById(id: string): Promise<IGeneration | null>;
    updateGeneration(data: IGeneration): Promise<IGeneration | null>;
    deleteGeneration(id: string): Promise<void>;
    listGenerations(): Promise<IGeneration[]>;
}
