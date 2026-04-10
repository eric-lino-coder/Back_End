-- Criar tabela contatos
CREATE TABLE IF NOT EXISTS contatos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    nascimento DATE,
    rg VARCHAR(20),
    sexo VARCHAR(20),
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_contatos_cpf ON contatos(cpf);
CREATE INDEX IF NOT EXISTS idx_contatos_email ON contatos(email);
CREATE INDEX IF NOT EXISTS idx_contatos_nome ON contatos(nome);
CREATE INDEX IF NOT EXISTS idx_contatos_created_at ON contatos(created_at DESC);

-- Comentários na tabela (opcional, para documentação)
COMMENT ON TABLE contatos IS 'Tabela para armazenar dados de contatos/pessoas';
COMMENT ON COLUMN contatos.cpf IS 'CPF único do contato';
COMMENT ON COLUMN contatos.email IS 'Email único do contato';
