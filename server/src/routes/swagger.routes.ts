import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BibleAppPro API',
      version: '1.0.0',
      description: 'API REST para aplicação de leitura bíblica',
      contact: {
        name: 'Suporte',
        email: 'contato@bibleapppro.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desenvolvimento',
      },
    ],
    tags: [
      { name: 'Autenticação', description: 'Endpoints de login e registro' },
      { name: 'Bíblia', description: 'Endpoints da bíblia' },
      { name: 'Usuário', description: 'Dados do usuário' },
    ],
    paths: {
      '/api/auth/register': {
        post: {
          tags: ['Autenticação'],
          summary: 'Registrar novo usuário',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password', 'name'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 },
                    name: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Usuário criado com sucesso' },
            400: { description: 'Dados inválidos' },
          },
        },
      },
      '/api/auth/login': {
        post: {
          tags: ['Autenticação'],
          summary: 'Login de usuário',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Login bem-sucedido' },
            401: { description: 'Credenciais inválidas' },
          },
        },
      },
      '/api/bible/versoes': {
        get: {
          tags: ['Bíblia'],
          summary: 'Listar versões disponíveis',
          responses: {
            200: {
              description: 'Lista de versões',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/bible/livros': {
        get: {
          tags: ['Bíblema'],
          summary: 'Listar livros',
          parameters: [
            {
              name: 'v',
              in: 'query',
              description: 'ID da versão',
              schema: { type: 'string', default: 'NVI' },
            },
          ],
          responses: {
            200: { description: 'Lista de livros' },
          },
        },
      },
      '/api/bible/livros/{bookId}/capitulos/{chapterId}/versiculos': {
        get: {
          tags: ['Bíblia'],
          summary: 'Obter versículos de um capítulo',
          parameters: [
            {
              name: 'bookId',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
            {
              name: 'chapterId',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
            {
              name: 'v',
              in: 'query',
              schema: { type: 'string', default: 'NVI' },
            },
          ],
          responses: {
            200: { description: 'Dados do capítulo' },
          },
        },
      },
      '/api/bible/busca': {
        get: {
          tags: ['Bíblia'],
          summary: 'Buscar na bíblia',
          parameters: [
            {
              name: 'q',
              in: 'query',
              required: true,
              description: 'Termo de busca',
              schema: { type: 'string' },
            },
            {
              name: 'v',
              in: 'query',
              schema: { type: 'string', default: 'NVI' },
            },
          ],
          responses: {
            200: { description: 'Resultados da busca' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const specs = swaggerJsdoc(options);

const swaggerRouter = Router();
swaggerRouter.use('/', swaggerUi.serve);
swaggerRouter.get(
  '/',
  swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'BibleAppPro API Docs',
  })
);

export default swaggerRouter;
