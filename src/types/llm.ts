export interface LLMProvider {
    generateText(pathToVideo: string, options?: LLMGenerateOptions): Promise<LLMResponse>;
}

export interface LLMGenerateOptions {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    stopSequences?: string[];
    [key: string]: any;
}

export interface LLMResponse {
    text: string;
    usage?: {
        promptTokens?: number;
        completionTokens?: number;
        totalTokens?: number;
    };
    rawResponse?: any;
}