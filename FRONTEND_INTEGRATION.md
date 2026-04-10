# Guia de Integração Frontend - Backend CRUD

Este guia show como integrar seu frontend React com o backend Express.

## 🔧 Configuração CORS

O backend já está configurado para aceitar requisições do frontend em `http://localhost:3000`.

Se seu frontend rodar em outra porta, atualize em `.env`:

```env
CORS_ORIGIN=http://localhost:SUA_PORTA
```

## 📝 Exemplo de Integração com React

### 1. Instalar axios (ou fetch nativo)

```bash
npm install axios
```

### 2. Criar um serviço de API

**src/services/contatoService.js**

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/contatos';

const contatoService = {
  // Listar todos
  listar: async (page = 1, limit = 10) => {
    const response = await axios.get(`${API_URL}?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Obter um por ID
  obter: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  // Criar novo
  criar: async (contato) => {
    const response = await axios.post(API_URL, contato);
    return response.data;
  },

  // Atualizar
  atualizar: async (id, contato) => {
    const response = await axios.put(`${API_URL}/${id}`, contato);
    return response.data;
  },

  // Deletar
  deletar: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },

  // Buscar por CPF
  buscarPorCPF: async (cpf) => {
    const response = await axios.get(`${API_URL}/search/cpf/${cpf}`);
    return response.data;
  },

  // Buscar por Email
  buscarPorEmail: async (email) => {
    const response = await axios.get(`${API_URL}/search/email/${email}`);
    return response.data;
  }
};

export default contatoService;
```

### 3. Usar em um componente React

**src/components/FormContato.jsx**

```javascript
import { useState } from 'react';
import contatoService from '../services/contatoService';

export default function FormContato() {
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    nascimento: "",
    rg: "",
    sexo: "",
    estadoCivil: "",
    pais: "",
    estado: "",
    cidade: "",
    bairro: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    celular: "",
    fixo: "",
    email: "",
    linkedin: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await contatoService.criar(formData);
      console.log('Contato criado:', response);
      alert('Contato criado com sucesso!');
      // Limpar formulário
      setFormData({...});
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao criar contato');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="nome"
        placeholder="Nome"
        value={formData.nome}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      {/* ... outros campos ... */}
      <button type="submit">Criar Contato</button>
    </form>
  );
}
```

**src/components/ListaContatos.jsx**

```javascript
import { useEffect, useState } from 'react';
import contatoService from '../services/contatoService';

export default function ListaContatos() {
  const [contatos, setContatos] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContatos();
  }, [pagina]);

  const fetchContatos = async () => {
    setLoading(true);
    try {
      const data = await contatoService.listar(pagina, 10);
      setContatos(data.contatos);
    } catch (error) {
      console.error('Erro ao listar:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza?')) {
      try {
        await contatoService.deletar(id);
        fetchContatos();
      } catch (error) {
        console.error('Erro ao deletar:', error);
      }
    }
  };

  return (
    <div>
      <h2>Contatos</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Email</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {contatos.map(contato => (
              <tr key={contato.id}>
                <td>{contato.nome}</td>
                <td>{contato.cpf}</td>
                <td>{contato.email}</td>
                <td>
                  <button onClick={() => handleDelete(contato.id)}>
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
```

## 🌐 Chamadas HTTP com Fetch (Alternativa sem axios)

```javascript
// GET - Listar
const response = await fetch('http://localhost:5000/api/contatos');
const dados = await response.json();

// POST - Criar
await fetch('http://localhost:5000/api/contatos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(novoContato)
});

// PUT - Atualizar
await fetch(`http://localhost:5000/api/contatos/${id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(contatoAtualizado)
});

// DELETE - Deletar
await fetch(`http://localhost:5000/api/contatos/${id}`, {
  method: 'DELETE'
});
```

## ✅ Checklist de Integração

- [ ] Backend rodando em http://localhost:5000
- [ ] Database configurada no Neon
- [ ] CORS_ORIGIN configurado no .env
- [ ] Frontend rodando em http://localhost:3000 (ou outra porta)
- [ ] Serviço de API criado no frontend
- [ ] Componentes fazendo chamadas corretas
- [ ] Testado POST, GET, PUT, DELETE

## 🐛 Troubleshooting

### CORS Error
- Verifique se `CORS_ORIGIN` está correto em `.env`
- Reinicie o servidor

### Connection refused
- Verifique se o backend está rodando: `npm run dev`
- Verifique a porta em `.env` (padrão: 5000)

### Database Error
- Verifique `DATABASE_URL` em `.env`
- Certifique-se que o schema foi criado em `database/schema.sql`

## 📞 Suporte

Para mais informações, consulte o README.md do projeto.
