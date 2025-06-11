import { LLMGenerateOptions, LLMProvider, LLMResponse } from '../../types';

import { GoogleGenAI, File, HarmCategory, HarmBlockThreshold, Part } from '@google/genai'; // Asegúrate de tener instalado este paquete
const API_KEY = process.env.LLM_API_KEY || ''; // O define tu API_KEY aquí

export class GeminiImplementationController implements LLMProvider {
  // Implementa aquí los métodos y propiedades definidos en la interfaz GeminiImplementation

  async generateText(pathToVideo: string): Promise<LLMResponse> {
    const prompt = 'Analiza este video y proporciona un resumen detallado.';
    const videoProcesado = await this.analyzeVideoWithGemini(pathToVideo, 'video/mp4', prompt);
    return {
      jobId: '12345', // Aquí deberías generar un ID único para el trabajo
      text: videoProcesado,
      rawResponse: null, // Aquí puedes incluir la respuesta cruda del modelo si es necesario
    };
  }

  private async analyzeVideoWithGemini(videoPath: string, videoMimeType: string, prompt: string): Promise<string> {
    const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];
    
    try {
      const genAI = new GoogleGenAI({ apiKey: API_KEY});
      const file: File = await genAI.files.upload({file: videoPath, config: {
      mimeType: videoMimeType
    }});
        // 2. Preparar el contenido para el modelo
    const model = genAI.models.generateContent({
      model: 'gemini-1.5-flash',
    });

    const parts: Part[] = [
      { text: prompt },
      {
        // Referenciar el archivo subido usando su URI
        fileData: {
          mimeType: videoFile.mimeType,
          fileUri: videoFile.uri,
        },
      },
    ];

    console.log("Enviando solicitud a Gemini con la referencia del archivo...");
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      // generationConfig: { // Opcional
      //   temperature: 0.4,
      //   maxOutputTokens: 8192,
      // },
    });

    const responseText = result.response.text();
    console.log("\n--- Respuesta de Gemini ---");
    console.log(responseText);
    console.log("-------------------------\n");
  } catch (error) {
    console.error("Error analizando el video con Gemini:", error);
    if (error instanceof Error && error.message.includes("SAFETY")) {
        console.error("La respuesta fue bloqueada debido a la configuración de seguridad.");
        // Podrías querer inspeccionar `error.response.promptFeedback` si existe
    } else if (error instanceof Error && error.message.includes("quota")) {
        console.error("Se ha excedido la cuota de la API. Revisa tu plan y uso en Google Cloud Console.");
    } else if (error instanceof Error && error.message.includes("Invalid API key")) {
        console.error("La API Key no es válida. Verifica que esté bien configurada.");
    }
  }
  return '';
};
}
