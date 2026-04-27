-- Criar tabela users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
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

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_contatos_cpf ON users(cpf);
CREATE INDEX IF NOT EXISTS idx_contatos_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_contatos_nome ON users(nome);
CREATE INDEX IF NOT EXISTS idx_contatos_created_at ON users(created_at DESC);
 
-- Comentários na tabela (opcional, para documentação)
COMMENT ON TABLE users IS 'Tabela para armazenar dados de users/pessoas';
COMMENT ON COLUMN users.cpf IS 'CPF único do contato';
COMMENT ON COLUMN users.email IS 'Email único do contato';
