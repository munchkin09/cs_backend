export interface IConfiguration {
    llmProvider: string; // Nombre del proveedor de LLM, por ejemplo, "gemini"
    llmApiKey: string; // Clave API para el proveedor de LLM
    dbConnectionString: string; // Cadena de conexión a la base de datos MongoDB
    environment?: string; // Entorno de ejecución, por ejemplo, "development" o "production"
}