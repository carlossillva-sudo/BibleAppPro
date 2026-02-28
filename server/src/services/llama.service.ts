export class LlamaService {
    /**
     * Call a local Llama-compatible HTTP endpoint.
     * Supports: Ollama, Text Generation WebUI, llama.cpp
     * 
     * Configure via environment variables:
     * - LLAMA_URL: base URL (default: http://localhost:8080)
     * - LLAMA_MODEL: model name for Ollama (default: llama2)
     * - LLAMA_TYPE: endpoint type - 'ollama', 'textgen', 'llamacpp' (default: detect from URL)
     */
    static async generate(prompt: string, options: any = {}): Promise<string> {
        const baseUrl = process.env.LLAMA_URL || 'http://localhost:8080';
        const model = process.env.LLAMA_MODEL || 'llama2';
        const type = this.detectType(baseUrl);

        try {
            let url = baseUrl;
            let body: any = { prompt };

            if (type === 'ollama') {
                // Ollama: POST /api/generate
                url = `${baseUrl}/api/generate`;
                body = {
                    model,
                    prompt,
                    stream: false,
                    ...options
                };
            } else if (type === 'textgen') {
                // Text Generation WebUI: POST /api/v1/completions
                url = `${baseUrl}/api/v1/completions`;
                body = {
                    prompt,
                    max_tokens: 500,
                    ...options
                };
            } else if (type === 'llamacpp') {
                // llama.cpp server: POST /completions
                url = `${baseUrl}/completions`;
                body = {
                    prompt,
                    n_predict: 500,
                    ...options
                };
            } else {
                // Fallback: generic endpoint
                url = `${baseUrl}/generate`;
                body = { prompt, ...options };
            }

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(`Llama service ${res.status}: ${txt.slice(0, 200)}`);
            }

            const data = await res.json();
            return this.extractText(data, type);
        } catch (err: any) {
            throw new Error(`Erro ao chamar Llama local: ${err.message}`);
        }
    }

    private static detectType(baseUrl: string): string {
        if (baseUrl.includes('ollama')) return 'ollama';
        if (baseUrl.includes('textgen') || baseUrl.includes('text-generation')) return 'textgen';
        if (baseUrl.includes('llamacpp')) return 'llamacpp';
        // default based on port common usage
        if (baseUrl.includes(':11434')) return 'ollama'; // Ollama default
        if (baseUrl.includes(':5000')) return 'textgen'; // Text Gen WebUI default
        if (baseUrl.includes(':8080')) return 'llamacpp'; // llama.cpp default
        return 'generic';
    }

    private static extractText(data: any, type: string): string {
        if (typeof data === 'string') return data;
        
        // Ollama: response.response
        if (type === 'ollama' && data.response) return data.response;
        
        // Text Gen WebUI: choices[0].text
        if (type === 'textgen' && data.choices?.[0]?.text) return data.choices[0].text;
        
        // llama.cpp: content
        if (type === 'llamacpp' && data.content) return data.content;
        
        // Generic fallbacks
        if (data.text) return data.text;
        if (data.response) return data.response;
        if (data.completion) return data.completion;
        if (data.choices?.[0]?.text) return data.choices[0].text;
        
        return JSON.stringify(data);
    }
}
