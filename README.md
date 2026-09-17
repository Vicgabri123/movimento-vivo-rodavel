# Movimento Vivo — versão rodável

Esta é uma versão independente para estudar e executar o frontend sem
depender do workspace original.

## Requisitos

- Node.js 18 ou superior
- npm 9 ou superior

## Rodar o frontend

Abra o terminal dentro desta pasta e execute:

```bash
npm install
npm run dev
```

Depois acesse o endereço mostrado no terminal, normalmente:

```text
http://localhost:5173
```

Para gerar uma versão de produção:

```bash
npm run build
npm run preview
```

## Rodar o backend de exemplo

O backend é independente e possui uma rota inicial de verificação:

```bash
npm run dev:api
```

Por padrão, ele escuta na porta `5000`. Para verificar:

```text
http://localhost:5000/api/healthz
```

Resposta esperada:

```json
{ "status": "ok" }
```

Este backend ainda é uma base Express. As telas do primeiro MVP usam dados
locais no navegador e não dependem dele. Para conectar os dois, crie as
rotas de usuários, grupos, aulas, presenças e fichas de saúde e depois troque
os estados locais de `src/App.tsx` por chamadas HTTP.

## Onde começar a estudar

- `src/App.tsx`: telas, navegação, dados de exemplo e interações
- `src/index.css`: tema, responsividade e acessibilidade
- `src/main.tsx`: inicialização do React
- `src/components/error-boundary.tsx`: tratamento de erros
- `backend/src/app.ts`: configuração do Express
- `backend/src/routes/health.ts`: exemplo de rota

## Comandos de verificação

```bash
npm run typecheck
npm run build
```

Não há banco de dados nesta versão. O modelo de banco deve ser adicionado
quando o frontend deixar de usar dados locais.