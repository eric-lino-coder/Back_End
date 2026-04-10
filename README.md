# Backend CRUD - Projeto Eric

Backend desenvolvido com **Node.js**, **Express** e **PostgreSQL (Neon)** para gerenciamento de usuários.

## 📋 Estrutura do Projeto

```
├── config/
│   └── database.js          # Configuração de conexão com PostgreSQL
├── controllers/
│   └── contatoController.js # Lógica de negócio (CRUD)
├── routes/
│   └── contatosRoutes.js    # Definição das rotas da API
├── database/
│   └── schema.sql           # Schema da tabela
├── server.js                # Arquivo principal
├── package.json             # Dependências do projeto
├── .env                     # Variáveis de ambiente (PRIVADO)
└── .env.example             # Exemplo de configuração
```

## 🚀 Instalação

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e atualize com suas credenciais:

```bash
cp .env.example .env
```

**Edite o arquivo `.env`:**

```env
DATABASE_URL=postgresql://usuario:senha@host/database
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 3. Criar o schema da database

Via Neon console ou pgAdmin:

1. Conecte-se ao seu banco de dados
2. Execute o SQL contido em `database/schema.sql`
3. Aguarde a criação da tabela e índices

## 🏃 Executar o servidor

### Modo produção
```bash
npm start
```

### Modo desenvolvimento (com auto-reload)
```bash
npm run dev
```

O servidor estará rodando em: **http://localhost:5000**

## 📡 Endpoints da API

### Base URL
```
http://localhost:5000/api/contatos
```

### 1. **Criar Contato** (POST)
```http
POST /api/contatos
Content-Type: application/json

{
  "nome": "João Silva",
  "cpf": "123.456.789-00",
  "nascimento": "1990-05-15",
  "rg": "12.345.678-9",
  "sexo": "M",
  "estadoCivil": "Solteiro",
  "pais": "Brasil",
  "estado": "SP",
  "cidade": "São Paulo",
  "bairro": "Centro",
  "cep": "01310-100",
  "logradouro": "Avenida Paulista",
  "numero": "1000",
  "complemento": "Apto 101",
  "celular": "(11) 98765-4321",
  "fixo": "(11) 3333-4444",
  "email": "joao@email.com",
  "linkedin": "linkedin.com/in/joaosilva"
}
```

**Resposta (201 Created):**
```json
{
  "message": "Contato criado com sucesso",
  "contato": {
    "id": 1,
    "nome": "João Silva",
    "cpf": "123.456.789-00",
    ...
  }
}
```

### 2. **Listar Contatos** (GET)
```http
GET /api/contatos?page=1&limit=10
```

**Resposta (200 OK):**
```json
{
  "contatos": [
    {
      "id": 1,
      "nome": "João Silva",
      ...
    }
  ],
  "paginacao": {
    "total": 50,
    "pagina": 1,
    "limite": 10,
    "totalPages": 5
  }
}
```

### 3. **Obter Contato por ID** (GET)
```http
GET /api/contatos/1
```

**Resposta (200 OK):**
```json
{
  "id": 1,
  "nome": "João Silva",
  "cpf": "123.456.789-00",
  ...
}
```

### 4. **Atualizar Contato** (PUT)
```http
PUT /api/contatos/1
Content-Type: application/json

{
  "nome": "João Silva Santos",
  "email": "joao.silva@email.com",
  ...
}
```

**Resposta (200 OK):**
```json
{
  "message": "Contato atualizado com sucesso",
  "contato": {
    "id": 1,
    "nome": "João Silva Santos",
    ...
  }
}
```

### 5. **Deletar Contato** (DELETE)
```http
DELETE /api/contatos/1
```

**Resposta (200 OK):**
```json
{
  "message": "Contato deletado com sucesso",
  "id": 1
}
```

### 6. **Buscar por CPF** (GET)
```http
GET /api/contatos/search/cpf/123.456.789-00
```

### 7. **Buscar por Email** (GET)
```http
GET /api/contatos/search/email/joao@email.com
```

## 🔧 Configuração do NEON

### Passo 1: Criar um projeto no Neon
1. Acesse [neon.tech](https://neon.tech)
2. Faça login ou crie uma conta
3. Clique em "Create Project"
4. Escolha PostgreSQL
5. Configure o nome do projeto e a região

### Passo 2: Obter a string de conexão
1. No dashboard do Neon, copie a connection string
2. Cole em `.env` na variável `DATABASE_URL`

Exemplo:
```
DATABASE_URL=postgresql://neon_user:password@ep-something.us-east-1.aws.neon.tech/neondb
```

### Passo 3: Executar o schema
```bash
psql $DATABASE_URL -f database/schema.sql
```

## 📚 Campos da Tabela Contatos

| Campo | Tipo | Obrigatório | Observações |
|-------|------|-------------|------------|
| id | SERIAL | ✅ | PK, Auto-increment |
| nome | VARCHAR(150) | ✅ | - |
| cpf | VARCHAR(14) | ✅ | UNIQUE |
| nascimento | DATE | ❌ | Formato: YYYY-MM-DD |
| rg | VARCHAR(20) | ❌ | - |
| sexo | VARCHAR(1) | ❌ | M ou F |
| estadoCivil | VARCHAR(50) | ❌ | - |
| pais | VARCHAR(100) | ❌ | - |
| estado | VARCHAR(2) | ❌ | Sigla: SP, RJ, etc |
| cidade | VARCHAR(100) | ❌ | - |
| bairro | VARCHAR(100) | ❌ | - |
| cep | VARCHAR(9) | ❌ | Formato: 12345-678 |
| logradouro | VARCHAR(255) | ❌ | - |
| numero | VARCHAR(20) | ❌ | - |
| complemento | VARCHAR(255) | ❌ | - |
| celular | VARCHAR(20) | ❌ | - |
| fixo | VARCHAR(20) | ❌ | - |
| email | VARCHAR(150) | ✅ | UNIQUE |
| linkedin | VARCHAR(255) | ❌ | - |
| created_at | TIMESTAMP | ✅ | Auto-preenchido |
| updated_at | TIMESTAMP | ✅ | Auto-atualizado |

## ✨ Validações

- **Nome, CPF e Email**: Obrigatórios
- **CPF**: Deve ser único
- **Email**: Deve ser único

## 🛡️ Tratamento de Erros

- `400`: Request inválido
- `404`: Contato não encontrado
- `409`: Conflito (CPF ou Email já existe)
- `500`: Erro interno do servidor

## 🧪 Testar a API

Use **Postman**, **Insomnia** ou **cURL**:

```bash
# Listar contatos
curl http://localhost:5000/api/contatos

# Criar contato (exemplo)
curl -X POST http://localhost:5000/api/contatos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Silva",
    "cpf": "987.654.321-00",
    "email": "maria@email.com"
  }'
```

## 📖 Ambiente

- **Node.js**: v16 ou superior
- **PostgreSQL**: 12 ou superior (via Neon)
- **npm**: v7 ou superior

## 📄 Licença

ISC

---

**Desenvolvido para o Projeto Eric** ✨
