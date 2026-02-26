# BibleAppPro

Uma plataforma moderna e completa para leitura, estudo e meditação bíblica. Desenvolvida com foco em UX premium, performance e mobilidade.

## 🚀 Tecnologias

### Monorepo
- **Concurrently**: Gerenciamento simultâneo do Backend e Frontend.

### Frontend (/client)
- **React 18** (Vite + TypeScript)
- **Tailwind CSS**: Estilização moderna e responsiva.
- **shadcn/ui**: Componentes de interface de alta qualidade.
- **Zustand**: Gerenciamento de estado global (Auth, Preferências).
- **React Query**: Sincronização de dados e cache eficiente.
- **Lucide React**: Biblioteca de ícones.

### Backend (/server)
- **Node.js** (Express + TypeScript)
- **fast-xml-parser**: Processamento de alta performance do `PortugueseBible.xml`.
- **JWT**: Autenticação segura.
- **Bcrypt.js**: Criptografia de senhas.
- **JSON Storage**: Persistência de dados simples e rápida.

---

## 🛠️ Como Executar

### Pré-requisitos
- Node.js instalado.

### Passo 1: Instalação
Na raiz do projeto, execute:
```bash
npm run install-all
```

### Passo 2: Desenvolvimento
Para rodar o backend e o frontend simultaneamente:
```bash
npm run dev
```

### Endereços
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api

---

## 📁 Estrutura do Projeto

```text
/
├── client/              # Aplicação React
│   ├── src/
│   │   ├── components/  # Componentes reutilizáveis
│   │   ├── hooks/       # Hooks customizados
│   │   ├── pages/       # Páginas da aplicação
│   │   ├── services/    # Integração com API
│   │   └── store/       # Estado global (Zustand)
├── server/              # API Express
│   ├── src/
│   │   ├── controllers/ # Lógica das rotas
│   │   ├── data/        # Arquivos JSON de persistência
│   │   ├── routes/      # Definição de endpoints
│   │   └── services/    # Lógica de negócio (Parser XML, Auth)
└── PortugueseBible.xml  # Base de dados bíblicos (ARA)
```

## 🔐 Rotas e Acesso
- `/login`: Acesso à plataforma.
- `/dashboard`: Visão geral da biblioteca.
- `/reader/:bookId/:chapterId`: Leitor PRO contínuo.
- `/search`: Busca avançada.
- `/favorites`: Versículos e anotações guardadas.

---
Desenvolvido com ❤️ por Antigravity (Google DeepMind).
