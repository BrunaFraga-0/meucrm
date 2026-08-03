# 💼 MeuCRM

---

# 📝 Sobre o Projeto

O **MeuCRM** é uma aplicação web full stack para cadastro e gerenciamento de clientes, desenvolvida como parte de um case técnico para a posição de **Desenvolvedora Full Stack Júnior**.

O sistema tem como objetivo permitir que um usuário autenticado gerencie sua base de clientes por meio de uma interface web, realizando operações de cadastro, listagem, busca, atualização e exclusão. O backend também utiliza uma fila assíncrona para simular o envio de uma mensagem de boas-vindas após cada novo cadastro.

---

# Status do projeto

**Versão funcional concluída para entrega do case.**

Os requisitos obrigatórios foram implementados: login, autenticação JWT, proteção de acesso, CRUD de clientes, busca por nome, persistência em PostgreSQL, migrations, seed do administrador, fila com BullMQ e Redis e execução completa com Docker Compose.

O frontend cumpre o fluxo principal do sistema, porém foi mantido intencionalmente simples devido ao prazo do case e ao fato de Next.js e React serem tecnologias novas para mim. As principais possibilidades de evolução estão registradas em [Melhorias futuras](#melhorias-futuras).

---

## Sumário

- [Sobre o projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Execução com Docker](#-como-executar-o-projeto-completo-com-docker)
- [Execução em desenvolvimento](#-como-executar-em-ambiente-de-desenvolvimento)
- [Arquitetura](#-arquitetura-e-fluxo-da-aplicação)
- [Endpoints](#-endpoints-da-api)
- [Melhorias futuras](#-melhorias-futuras)
- [Uso de IA](#-uso-de-inteligência-artificial-e-fontes-de-estudo)

---

# 📚 Funcionalidades

- Login com e-mail e senha;
- Criação automática do usuário administrador por seed;
- Senhas armazenadas como hash com `bcryptjs`;
- Geração e validação de token JWT;
- Proteção dos endpoints de clientes no backend;
- Redirecionamento para a tela de login quando não há token ou ele é recusado pela API;
- Cadastro de clientes;
- Listagem de clientes em tabela;
- Busca por nome sem diferenciar maiúsculas e minúsculas;
- Edição de clientes;
- Exclusão com confirmação;
- Validação dos dados de entrada;
- Prevenção de e-mails duplicados;
- Persistência em PostgreSQL com TypeORM e migrations;
- Criação de um job na fila `welcome-email` após o cadastro;
- Processamento do job com BullMQ e Redis;
- Simulação do envio de boas-vindas por log no terminal;
- Execução de frontend, backend, PostgreSQL e Redis com Docker Compose.

---

# 🛠 Tecnologias

## Backend

- Node.js
- TypeScript
- NestJS
- TypeORM
- PostgreSQL
- `class-validator` e `class-transformer`
- JWT e Passport
- `bcryptjs`
- BullMQ
- Redis

## Frontend

- Next.js com App Router;
- React;
- TypeScript;
- CSS Modules;
- Fetch API.

## Infraestrutura e desenvolvimento

- Docker e Docker Compose
- Git e GitHub
- Thunder Client e Postman para validação manual dos endpoints
- pgAdmin para apoio na inspeção do banco de dados

---

# 📋 Como executar o projeto completo com Docker

Esta é a maneira recomendada para avaliar e utilizar a aplicação. O Docker Compose inicia os quatro serviços e o backend executa as migrations e o seed automaticamente.
 
## Pré-requisitos

- Git;
- Docker Desktop ou Docker Engine com Docker Compose.

Não é necessário instalar Node.js, npm, PostgreSQL ou Redis localmente para esta forma de execução.

## 🚀 Instalação e Execução
### 1. Clone o repositório

```bash
git clone https://github.com/BrunaFraga-0/meucrm.git
cd meucrm
```

### 2. Construa e inicie todos os serviços

```bash
docker compose up --build
```

Na primeira execução, o comando pode levar alguns minutos para baixar as imagens, instalar as dependências e construir as aplicações.

Ao iniciar, o backend executa automaticamente:

1. as migrations do TypeORM;
2. o seed do usuário administrador;
3. a API NestJS.

O seed é idempotente: se o administrador já existir, ele não será duplicado.

### 3. Acesse a aplicação

- Frontend: [http://localhost:3001](http://localhost:3001)
- API: [http://localhost:3000](http://localhost:3000)

Credenciais para demonstração:

```text
E-mail: admin@meucrm.com
Senha: 123456
```

Depois do login, a aplicação direciona o usuário à página de clientes, onde todas as operações do CRUD podem ser realizadas.

Ao cadastrar um cliente, o terminal do Docker Compose exibirá o processamento da fila com uma mensagem semelhante a:

```text
Enviando boas-vindas para João <joao@empresa.com>
```

### 4. Encerrar a aplicação

Em outro terminal, na raiz do projeto, execute:

```bash
docker compose down
```

Os dados do PostgreSQL permanecem no volume `pgdata`. Para remover também o banco criado e reiniciar o projeto sem dados, use:

```bash
docker compose down -v
```

> Atenção: a opção `-v` exclui permanentemente os dados armazenados no volume do projeto.

---

# 📋 Como executar em ambiente de desenvolvimento

Nesta opção, apenas PostgreSQL e Redis são executados em containers. Backend e frontend são iniciados localmente, com atualização automática durante as alterações no código.

## Pré-requisitos

- Git;
- Node.js 22 ou versão compatível;
- npm;
- Docker Desktop ou Docker Engine com Docker Compose;
- Visual Studio Code ou outra IDE compatível.

O pgAdmin, o Thunder Client e o Postman são opcionais, mas podem ser utilizados para visualizar o banco de dados e testar os endpoints da API.

## 🚀 Instalação e Execução

### 1. Clone o repositório

```bash
git clone https://github.com/BrunaFraga-0/meucrm.git
```

Acesse a pasta do projeto:

```bash
cd meucrm
```

Rode o comando:

```bash
docker compose up -d postgres redis
```

Esse comando inicia os containers do:

- PostgreSQL;
- Redis.

Para verificar o estado dos containers:

```bash
docker compose ps
```

No ambiente local, o PostgreSQL é exposto na porta `5433` para evitar conflito com uma possível instalação local na porta padrão `5432`. O Redis utiliza a porta `6379`.

### 2. Configure e inicie o backend

Em um terminal:

```bash
cd backend
npm install
cp .env.example .env
npm run typeorm -- migration:run
npm run seed:admin
npm run start:dev
```

A API estará disponível em [http://localhost:3000](http://localhost:3000).

O arquivo `backend/.env.example` já contém os valores necessários para o desenvolvimento local:

```env
PORT=3000

PG_HOST=localhost
PG_PORT=5433
PG_TIME_OUT_MS=30000
PG_DATABASE=meucrm
PG_USER=postgres
PG_PASSWORD=postgres

ADMIN_NAME=Admin
ADMIN_EMAIL=admin@meucrm.com
ADMIN_PASSWORD=123456

JWT_SECRET=insira-sua_chave_secreta_aqui
JWT_EXPIRES_IN=1800

REDIS_HOST=localhost
REDIS_PORT=6379
```

> O `.env.example` possui apenas valores de demonstração. Em uma aplicação publicada, senhas e segredos devem ser substituídos por valores fortes e mantidos fora do repositório.

### 3. Configure e inicie o frontend

Em um segundo terminal, a partir da raiz do projeto:

```bash
cd frontend
npm install
npm run dev -- -p 3001
```

Acesse [http://localhost:3001](http://localhost:3001) e utilize as credenciais do administrador.

> Nesta versão, o endereço da API está definido no frontend como `http://localhost:3000`. A configuração por variável de ambiente é uma melhoria futura.

### 4. Encerrar a infraestrutura local

Depois de interromper backend e frontend com `Ctrl + C`, execute na raiz:

```bash
docker compose down
```

---

# 📂 Arquitetura e fluxo da aplicação

O repositório possui dois projetos independentes, integrados pelo Docker Compose:

```text
meucrm/
├── .gitignore
├── README.md
├── docker-compose.yml
│
├── backend/
│   ├── .dockerignore
│   ├── .env.example
│   ├── .prettierrc
│   ├── Dockerfile
│   ├── eslint.config.mjs
│   ├── nest-cli.json
│   ├── package-lock.json
│   ├── package.json
│   ├── tsconfig.build.json
│   ├── tsconfig.json
│   │
│   ├── seeds/
│   │   └── admin.seed.ts
│   │
│   ├── src/
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   ├── app.service.ts
│   │   ├── main.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── dto/
│   │   │   │   └── login.dto.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── jwt.strategy.ts
│   │   │
│   │   ├── clientes/
│   │   │   ├── dto/
│   │   │   │   ├── create-cliente.dto.ts
│   │   │   │   └── update-cliente.dto.ts
│   │   │   ├── cliente.entity.ts
│   │   │   ├── clientes.controller.ts
│   │   │   ├── clientes.module.ts
│   │   │   ├── clientes.service.ts
│   │   │   └── welcome-email.processor.ts
│   │   │
│   │   ├── database/
│   │   │   ├── data-source.ts
│   │   │   └── migrations/
│   │   │       ├── 1785584950587-CreateClientesTable.ts
│   │   │       └── 1785620017891-CreateUsuariosTable.ts
│   │   │
│   │   └── usuarios/
│   │       └── usuario.entity.ts
│
├── frontend/
│   ├── .dockerignore
│   ├── .gitignore
│   ├── Dockerfile
│   ├── eslint.config.mjs
│   ├── next-env.d.ts
│   ├── next.config.ts
│   ├── package-lock.json
│   ├── package.json
│   ├── tsconfig.json
│   │
│   └── src/
│       └── app/
│           ├── clientes/
│           │   ├── page.module.css
│           │   └── page.tsx
│           ├── favicon.ico
│           ├── globals.css
│           ├── layout.tsx
│           ├── page.module.css
│           └── page.tsx
```

As pastas e os arquivos gerados automaticamente, como .git, node_modules, dist e .next, não foram representados por não fazerem parte do código-fonte que precisa ser analisado ou editado.

No backend, a organização segue o padrão modular do NestJS:

- **Controller:** recebe as requisições HTTP e encaminha os dados;
- **DTO + ValidationPipe:** valida e transforma os dados recebidos;
- **Service:** concentra regras de negócio e coordena banco e fila;
- **Entity/Repository:** representa e acessa os dados no PostgreSQL;
- **Guard + Strategy:** validam o JWT antes do acesso às rotas protegidas;
- **Processor:** consome os jobs da fila em segundo plano.

### Fluxo resumido do cadastro:

```text
Frontend
  -> POST /clientes com Bearer Token
  -> ClientesController
  -> CreateClienteDto + ValidationPipe
  -> ClientesService
     -> PostgreSQL: salva o cliente
     -> BullMQ: adiciona o job send-welcome
  -> Redis
  -> WelcomeEmailProcessor
  -> log de boas-vindas no terminal
```

---

# 🌐 Endpoints da API

| Método | Endpoint | Descrição | Autenticação |
| --- | --- | --- | --- |
| `GET` | `/` | Verifica se a API está em execução | Não |
| `POST` | `/auth/login` | Valida as credenciais e retorna o token JWT | Não |
| `GET` | `/clientes` | Lista todos os clientes | Bearer Token |
| `GET` | `/clientes?busca=nome` | Busca clientes por nome | Bearer Token |
| `GET` | `/clientes/:id` | Consulta um cliente pelo UUID | Bearer Token |
| `POST` | `/clientes` | Cadastra um cliente e adiciona o job de boas-vindas | Bearer Token |
| `PUT` | `/clientes/:id` | Atualiza os dados de um cliente | Bearer Token |
| `DELETE` | `/clientes/:id` | Exclui um cliente | Bearer Token |

Mais detalhes sobre o token e o fluxo de login estão descritos na seção [Autenticação](#-autenticação).

---

# ✅ Validações e Regras de Negócio

- `nome`, `email` e `telefone` são obrigatórios;
- `nome` aceita até 100 caracteres;
- `email` deve possuir formato válido, aceita até 255 caracteres e deve ser único;
- `telefone` deve seguir o formato `(XX) 9XXXX-XXXX`, com DDD iniciado entre 1 e 9;
- `empresa` é opcional e aceita até 100 caracteres;
- `observacoes` é opcional;
- identificadores são UUIDs gerados automaticamente;
- `criadoEm` é preenchido automaticamente;
- propriedades que não existem no DTO são rejeitadas pelo `ValidationPipe`;
- a busca remove espaços externos e utiliza comparação parcial sem diferenciar maiúsculas e minúsculas;
- o usuário recebe uma mensagem genérica quando as credenciais são inválidas, sem revelar qual campo falhou;
- o token expira após 1.800 segundos, conforme a configuração atual;
- as rotas de clientes exigem JWT válido;
- cada novo cliente gera um job na fila `welcome-email`.

---

# 🗃 Banco de Dados, migrations e seed

O MeuCRM utiliza PostgreSQL para persistência dos dados. O acesso ao banco é realizado pelo TypeORM, por meio de entities e repositories.

## Tabela `clientes`

| Coluna | Tipo | Regra |
|---|---|---|
| `id` | UUID | Chave primária e geração automática |
| `nome` | `varchar(100)` | Obrigatório |
| `email` | `varchar(255)` | Obrigatório e único |
| `telefone` | `varchar(20)` | Obrigatório |
| `empresa` | `varchar(100)` | Opcional |
| `observacoes` | `text` | Opcional |
| `criado_em` | `timestamp` | Preenchimento automático com `now()` |


## Tabela `usuarios`

| Coluna | Tipo | Regra |
| --- | --- | --- |
| `id` | UUID | Chave primária e geração automática |
| `nome` | `varchar(100)` | Obrigatório |
| `email` | `varchar(255)` | Obrigatório e único |
| `senha` | `varchar(255)` | Obrigatório e armazenado como hash |

O TypeORM utiliza `synchronize: false`. Portanto, a estrutura do banco é criada e atualizada exclusivamente pelas migrations versionadas.

As migrations existentes criam:

- a extensão necessária para geração de UUIDs;
- a tabela `clientes`;
- a tabela `usuarios`.

O seed lê `ADMIN_NAME`, `ADMIN_EMAIL` e `ADMIN_PASSWORD`, gera o hash da senha com `bcryptjs` e cria o administrador somente se o e-mail ainda não existir.

Comandos úteis no backend:

| Comando | Descrição |
| --- | --- |
| `npm run typeorm -- migration:show` | Exibe as migrations e seus estados |
| `npm run typeorm -- migration:run` | Executa as migrations pendentes em desenvolvimento |
| `npm run typeorm -- migration:revert` | Reverte a última migration em desenvolvimento |
| `npm run seed:admin` | Cria o administrador no ambiente de desenvolvimento |

---

# 🔐 Autenticação

A aplicação utiliza autenticação com **JWT (JSON Web Token)** para controlar o acesso às funcionalidades de gerenciamento de clientes.

O usuário administrador é criado pelo seed do backend. Sua senha é transformada em hash com `bcryptjs` antes de ser armazenada no PostgreSQL.

## Credenciais de demonstração

```text
E-mail: admin@meucrm.com
Senha: 123456
```

## Fluxo de autenticação

```text
E-mail e senha
    → POST /auth/login
        → busca do usuário no PostgreSQL
            → comparação da senha com bcryptjs
                → geração do token JWT
                    → armazenamento do token no frontend
                        → envio do Bearer Token nas rotas protegidas
```

O endpoint de login retorna o token no seguinte formato:

```json
{
  "access_token": "token-jwt"
}
```

Para acessar os endpoints de clientes, o frontend envia o token no cabeçalho da requisição:

```text
Authorization: Bearer token-jwt
```

No backend, o `JwtAuthGuard` e a `JwtStrategy` verificam a validade do token antes de permitir o acesso às rotas de clientes.

No frontend, o token é armazenado no `localStorage`. Quando ele não está disponível ou a API retorna o status `401 Unauthorized`, o usuário é redirecionado para a tela de login.

Na configuração atual, o token expira após 1.800 segundos, equivalentes a 30 minutos.

---

# 📬 BullMQ e Redis

A aplicação utiliza `BullMQ` e `Redis` para realizar o processamento assíncrono da mensagem de boas-vindas.

Após o cadastro de um novo cliente, o backend adiciona um job chamado `send-welcome` à fila `welcome-email`, contendo o nome e o e-mail do cliente.

O fluxo ocorre da seguinte forma:

```text
Cadastro do cliente
    → dados salvos no PostgreSQL
        → job adicionado à fila welcome-email
            → job armazenado no Redis
                → WelcomeEmailProcessor processa o job
                    → mensagem registrada no terminal
```

O processor simula o envio da mensagem de boas-vindas por meio de um log semelhante a:

```text
Enviando boas-vindas para João <joao@empresa.com>
```

Não há integração com um serviço SMTP nesta versão. O envio real de e-mails não era obrigatório no case, e o registro no terminal comprova que o job foi adicionado e processado corretamente.

---

# Scripts principais

### Backend

| Comando | Descrição |
| --- | --- |
| `npm run start:dev` | Inicia o NestJS em modo de desenvolvimento |
| `npm run build` | Compila o backend |
| `npm run start:prod` | Executa a versão compilada |
| `npm run lint` | Executa o ESLint e aplica as correções configuradas |
| `npm run format` | Formata os arquivos TypeScript com Prettier |

### Frontend

| Comando | Descrição |
| --- | --- |
| `npm run dev -- -p 3001` | Inicia o Next.js em desenvolvimento na porta do projeto |
| `npm run build` | Gera a build do frontend |
| `npm run start -- -p 3001` | Executa a build na porta do projeto |
| `npm run lint` | Executa o ESLint |

---

# 🌿 Versionamento

O projeto utiliza branches para separar o desenvolvimento das funcionalidades e manter a branch principal estável.

## Branches

```text
main
dev
chore/*
feat/*
fix/*
style/*
docs/*
```

- **main:** versão estável e preparada para entrega;
- **dev:** integração das funcionalidades durante o desenvolvimento;
- **chore/:** configurações, manutenção e revisão da estrutura do projeto;
- **feat/:** desenvolvimento de novas funcionalidades;
- **fix/:** correções específicas;
- **style/:** ajustes de formatação e aparência que não alteram as regras de negócio.
- **docs/:** criação e atualização da documentação.

### Branchs Temporárias Utilizadas

```text
chore/configura-infraestrutura
chore/configura-typeorm
feat/crud-clientes
fix/atualiza-clientes
docs/atualiza-readme
feat/autenticacao
chore/revisao-backend
feat/fila-boas-vindas
style/formata-backend
feat/frontend
chore/configuracao-next
feat/login-frontend
feat/listagem-clientes-frontend
feat/crud-clientes-frontend
style/interface-frontend
feat/dockerizacao
docs/finalizacao-readme
```

## Fluxo resumido

```text
dev
    → branch temporária
        → implementação
            → build, lint e testes manuais
                → commit e push
                    → integração em dev
                        → revisão final
                            → main
```

---

# Decisões e limitações da versão entregue

- O frontend foi concentrado em duas páginas: login e clientes. Cadastro e edição compartilham o mesmo formulário na página de clientes.
- A interface utiliza componentes cliente e Fetch API diretamente nas páginas. Não foi criada uma camada de serviços ou um contexto de autenticação.
- O token é armazenado no `localStorage`. A página de clientes verifica sua presença e redireciona para o login; respostas `401` também removem o token e redirecionam o usuário.
- A proteção principal dos dados está no backend por meio do `JwtAuthGuard`. Não há `middleware` do Next.js nesta versão.
- A URL da API está fixa para o ambiente local.
- O envio de e-mail é apenas simulado no terminal, como solicitado no case; não há integração SMTP.
- Não foram implementados paginação, ordenação, Bull Board ou testes automatizados, por serem itens opcionais e devido ao prazo disponível para o desenvolvimento.
- O projeto não possui deploy em produção.

---

# 🚀 Melhorias futuras

## Backend

- adicionar testes unitários, de integração e ponta a ponta para autenticação, clientes e fila;
- validar as variáveis de ambiente na inicialização e separar configurações por ambiente;
- fortalecer a autenticação com cookies `HttpOnly`, renovação de token e regras mais completas para usuários;
- adicionar tentativas, atraso, monitoramento e tratamento de falhas dos jobs, além da futura integração com um serviço real de e-mail;
- implementar paginação, ordenação e documentação da API com Swagger.

## Frontend

- dividir a tela em componentes reutilizáveis e criar rotas próprias para cadastro e edição;
- centralizar requisições em uma camada de API e definir o endereço do backend por variável de ambiente;
- usar recursos do Next.js de forma mais completa, incluindo layouts aninhados, estados de carregamento e erro e uma estratégia de proteção baseada em cookies e middleware;
- aprimorar feedbacks de validação e da API, adicionando máscara de telefone, toasts e indicadores de carregamento;
- melhorar responsividade, acessibilidade e experiência da tabela, com paginação e ordenação.

---

# 🤖 Uso de Inteligência Artificial e fontes de estudo

O **ChatGPT** foi utilizado de forma frequente e transparente como ferramenta de apoio e orientação durante o desenvolvimento deste case, especialmente por NestJS, Next.js, Autenticação, BullMQ e Docker Compose ainda serem tecnologias novas no meu processo de aprendizagem.

A ferramenta foi utilizada para:

- ajudar a interpretar os requisitos e organizar o desenvolvimento por etapas;
- explicar conceitos do NestJS, como módulos, injeção de dependência, DTOs, guards, strategies e repositories;
- esclarecer o funcionamento de TypeORM, migrations, seed, PostgreSQL, BullMQ, Redis, JWT e Docker;
- discutir alternativas de implementação adequadas ao meu nível de conhecimento e ao prazo disponível;
- revisar códigos escritos durante o desenvolvimento e apoiar a identificação de erros;
- auxiliar em problemas de integração entre Next.js e NestJS, incluindo Fetch API, CORS, token Bearer, `useEffect` e ESLint;
- revisar Dockerfiles, Docker Compose, comandos de execução e esta documentação.

Além da IA, foram consultadas as **documentações oficiais das tecnologias utilizadas**, principalmente NestJS, Next.js, TypeORM, Docker e BullMQ, e vídeos técnicos no **YouTube** para complementar a compreensão prática. Algumas referências e conceitos iniciais também partiram de recomendações do meu professor de backend, que indicou caminhos de estudo para tecnologias que eu ainda não conhecia.

As respostas e sugestões recebidas não foram aplicadas sem revisão. Os trechos foram lidos, comparados com a documentação, adaptados à estrutura do projeto e validados por meio de builds, lint, execução da aplicação e testes manuais dos fluxos e endpoints. As decisões finais, a implementação, os comandos executados e a revisão do comportamento da aplicação foram realizados por mim.

---

## Aprendizados

O principal desafio foi construir, em um prazo curto, uma aplicação completa utilizando várias tecnologias que ainda não faziam parte da minha experiência prática, especialmente NestJS, Next.js, Docker e Autenticação. O desenvolvimento me permitiu exercitar a integração entre frontend, API, banco de dados e processamento assíncrono, além de aprofundar conhecimentos sobre autenticação, migrations, containers e organização modular.

A versão entregue prioriza requisitos funcionais e clareza de código. As limitações foram mantidas documentadas para representar com honestidade o estágio atual do projeto e os próximos passos de aprendizagem.

---

## 👩‍💻 Autora

**Bruna Caroline Fraga**

- GitHub: [BrunaFraga-0](https://github.com/BrunaFraga-0)
- Projeto: [github.com/BrunaFraga-0/meucrm](https://github.com/BrunaFraga-0/meucrm)

---

# 📄 Finalidade

Projeto desenvolvido para fins de avaliação técnica e aprendizado.

---