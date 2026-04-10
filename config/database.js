import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Teste de conexão
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Erro de conexão com o Neon:", err);
  } else {
    console.log(
      "✅ Banco de dados conectado com sucesso! Hora no servidor:",
      res.rows[0].now,
    );
  }
});
-pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

export default pool;
