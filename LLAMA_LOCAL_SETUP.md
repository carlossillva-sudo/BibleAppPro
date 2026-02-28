# Configuração Llama Local

O BibleAppPro suporta integração com Llama Local através de múltiplos endpoints compatíveis:

## Opções de Servidor

### 1. Ollama (Recomendado)
Opção mais simples e moderna.

**Instalação:**
```bash
# Windows/Mac/Linux
https://ollama.ai
```

**Iniciar:**
```bash
ollama serve
# Servidor rodará em http://localhost:11434
```

**Configurar .env:**
```
LLAMA_URL=http://localhost:11434
LLAMA_MODEL=llama2
LLAMA_TYPE=ollama
```

### 2. Text Generation WebUI
Interface gráfica mais completa.

**Instalação:**
```bash
git clone https://github.com/oobabooga/text-generation-webui
cd text-generation-webui
pip install -r requirements.txt
python server.py --listen 127.0.0.1 --listen-port 5000
```

**Configurar .env:**
```
LLAMA_URL=http://localhost:5000
LLAMA_TYPE=textgen
```

### 3. llama.cpp Server
Build nativo e rápido.

**Instalação:**
```bash
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
make
./server -m model.gguf -ngl 33 --port 8080
```

**Configurar .env:**
```
LLAMA_URL=http://localhost:8080
LLAMA_TYPE=llamacpp
```

## Testar no BibleAppPro

Após configurar Llama Local:

1. Acesse a página `/chat` no navegador
2. Mude para a aba "Assistente"
3. Digite uma pergunta (ex: "Qual é o principal ensinamento de Jesus?")
4. Clique em "Gerar"

A resposta virá do seu servidor Llama local.

## Variáveis de Ambiente

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `LLAMA_URL` | `http://localhost:8080` | URL do servidor Llama |
| `LLAMA_MODEL` | `llama2` | Modelo para Ollama (ignorado em outros) |
| `LLAMA_TYPE` | auto-detect | Tipo de endpoint: `ollama`, `textgen`, `llamacpp` |

## Troubleshooting

**Erro: "Erro ao chamar Llama local"**
- Verifica se o servidor Llama está rodando
- Confirma a URL em `LLAMA_URL`
- Checa logs do servidor Llama para detalhes

**Lentidão**
- Reduz `n_predict` (llama.cpp) ou `max_tokens` (Text Gen) em `server/src/services/llama.service.ts`
- Usa um modelo menor ou quantizado

**Token não reconhecido**
- Certifica-se de estar autenticado na rota `/api/ai/generate`
