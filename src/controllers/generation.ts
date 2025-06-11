import { LLMProvider, IGenerationController, IConfiguration } from "../types";
import { GeminiImplementationController } from "./llms/gemini_implementation";


export function buildGenerationController(configuration: IConfiguration): IGenerationController {
    if(!configuration || !configuration.llmProvider) {
        throw new Error("Configuration and llmProvider are required to build the GenerationController");
    }

    let llmProviderInstance: LLMProvider;
    switch (configuration.llmProvider) {
        case 'gemini':
            llmProviderInstance = new GeminiImplementationController();
            break;
        default:
            throw new Error(`Unsupported LLM provider: ${configuration.llmProvider}`);
    }
    return {
        createGeneration: async (data) => {
            const { jobId } = await llmProviderInstance.generateText(data.pathToVideo);
            return jobId || ''; // Retorna el jobId o una cadena vacía si no está disponible
        },

        getGenerationById: async (id) => {
            // Aquí iría la lógica para obtener una generación por ID
            return null; // Placeholder
        },

        updateGeneration: async (data) => {
            // Aquí iría la lógica para actualizar una generación
            return null; // Placeholder
        },

        deleteGeneration: async (id) => {
            // Aquí iría la lógica para eliminar una generación
        },

        listGenerations: async () => {
            // Aquí iría la lógica para listar todas las generaciones
            return [];
        }
    }
}
