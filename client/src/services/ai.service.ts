import api from './api';

export const AIService = {
    generate: async (prompt: string, options?: any) => {
        const res = await api.post('/ai/generate', { prompt, options });
        return res.data;
    }
};
