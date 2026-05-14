-- Criar tabela users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    role_id UUID NOT NULL,
    nome VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    nascimento DATE,
    rg VARCHAR(20),
    sexo VARCHAR(9),
    estadoCivil VARCHAR(50),
    pais VARCHAR(100),
    estado VARCHAR(2),
    cidade VARCHAR(100),
    bairro VARCHAR(100),
    cep VARCHAR(9),
    logradouro VARCHAR(255),
    numero VARCHAR(20),
    complemento VARCHAR(255),
    celular VARCHAR(20),
    fixo VARCHAR(20),
    email VARCHAR(150) NOT NULL UNIQUE,
    linkedin VARCHAR(255),
    password_hash VARCHAR(60) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id UUID PRIMAexitRY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Roles_Permissions (
    id UUID PRIMARY KEY,
    role_id UUID NOT NULL,
    permission_id UUID NOT NULL
);

CREATE TABLE Permissions (
    id           UUID PRIMARY KEY,
    name         VARCHAR(100) NOT NULL,
    code         VARCHAR(100) UNIQUE NOT NULL,
    description  VARCHAR(255),
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_contatos_cpf ON users(cpf);
CREATE INDEX IF NOT EXISTS idx_contatos_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_contatos_nome ON users(nome);
CREATE INDEX IF NOT EXISTS idx_contatos_created_at ON users(created_at DESC);
 
-- Comentários na tabela (opcional, para documentação)
COMMENT ON TABLE users IS 'Tabela para armazenar dados de users/pessoas';
COMMENT ON COLUMN users.cpf IS 'CPF único do contato';
COMMENT ON COLUMN users.email IS 'Email único do contato';

--
ALTER TABLE users
ADD CONSTRAINT fk_users_role
FOREIGN KEY (role_id) REFERENCES roles(id);

ALTER TABLE role_permissions
ADD CONSTRAINT fk_role_permissions_role
FOREIGN KEY (role_id) REFERENCES roles(id);

ALTER TABLE role_permissions
ADD CONSTRAINT fk_role_permissions_permission
FOREIGN KEY (permission_id) REFERENCES permissions(id);



