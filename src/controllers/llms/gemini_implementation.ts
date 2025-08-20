import { LLMProvider, LLMResponse } from '../../types/index.js';

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

    const fs = await import('fs/promises');
    
    try {
      // Verificar tamaño del archivo antes de procesarlo
      const stats = await fs.stat(videoPath);
      const fileSizeInMB = stats.size / (1024 * 1024);
      
      console.log(`Tamaño del video: ${fileSizeInMB.toFixed(2)} MB`);
      
      // Límite de aproximadamente 20MB para base64 (se expande ~33% al codificar)
      if (stats.size > 20 * 1024 * 1024) {
        throw new Error(`El archivo es demasiado grande (${fileSizeInMB.toFixed(2)} MB). El límite es de aproximadamente 20MB.`);
      }

      const videoBuffer = await fs.readFile(videoPath);
      const base64Video = videoBuffer.toString('base64');
      
      const genAI = new GoogleGenAI({ apiKey: API_KEY });
      
      const promptText = `Hola, te voy a pasar un video para que puedas procesarlo, te voy a dar unas cuantas instrucciones sobre el contenido, lo que tienes que analizar, y que clase de output espero. El video es un jugador de Counter Strike 2 jugando las primeras rondas de una partida competitiva. Deberás hacer un análisis con las siguientes cualidades: Analiza y expón las cualidades vitales de la persona que estás viendo jugar. Usa un lenguaje poco formal, muy rollo de los 90, como tu sabes, guapetón(usa esta ultima frase como ejemplo de lenguaje desenfadado). Una vez tengas un análisis de la persona que estás viendo jugar deberás decidir un conjunto de Skins que consideres que pegarían con el estilo del jugador y con su forma de ser. Por cada arma, personaje, guantes o cuchillo que elijas deberás proporcionar una justificación de por que has elegido este elemento. El formato esperado será un JSON con la siguiente definición: { "type_skin": "gloves|knife|weapon|character", "choosen_skin": "string", "justification": "string" } Después de terminar el análisis dedica unas palabras a dar una última reflexión sobre como juega el jugador, que sea inspiradora y permita que quien lo lea se pueda sentir identificado(ten en cuenta el efecto forer, las personas aceptas muy bien los halagos ligeros o vagos que no se meten en mucho detalle). Aquí te dejo el video que debes analizar, espero que te lo pases igual de bien que yo haciendo esto:`;

      const config = { 
        responseMimeType: 'text/plain',
        safetySettings: safetySettings
      };
      
      const model = 'gemini-2.5-pro';
      
      const contents = [{
        role: 'user',
        parts: [
          { text: promptText },
          {
            inlineData: {
              data: base64Video,
              mimeType: 'video/mp4'
            }
          }
        ]
      }];

      const response = await genAI.models.generateContentStream({ model, config, contents });
      
      let responseText = '';
      for await (const chunk of response) {
        if (chunk.text) {
          const chunkText = chunk.text;
          responseText += chunkText;
          console.log(chunkText);
        }
      }

      console.log("\n--- Respuesta de Gemini ---");
      console.log(responseText);
      console.log("-------------------------\n");
      
      return responseText;
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
