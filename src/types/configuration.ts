export interface IConfiguration {
    llmProvider: string; // Nombre del proveedor de LLM, por ejemplo, "gemini"
    llmApiKey: string; // Clave API para el proveedor de LLM
    databaseUrl: string; // URL de la base de datos
    databaseName: string; // Nombre de la base de datos
}