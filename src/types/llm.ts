export interface LLMProvider {
    generateText(pathToVideo: string): Promise<LLMResponse>;
}

export interface LLMResponse {
    jobId?: string;
    text: string;
    rawResponse?: any;
}