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

// ==============================
// LOGGER DE QUERY (estilo ORM)
// ==============================
export const query = async (text, params) => {
  const start = Date.now();

  console.log("\n==============================");
  console.log("SQL:", text);
  console.log("PARAMS:", params);

  try {
    const res = await pool.query(text, params);

    const duration = Date.now() - start;

    console.log("ROWS:", res.rowCount);
    console.log("TIME:", duration + "ms");
    console.log("==============================\n");

    return res;
  } catch (err) {
    console.error("❌ ERRO NA QUERY:");
    console.error("SQL:", text);
    console.error("PARAMS:", params);
    console.error(err);
    console.log("==============================\n");
    throw err;
  }
};

// ==============================
// TESTE DE CONEXÃO
// ==============================
(async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log(
      "✅ Banco de dados conectado com sucesso! Hora no servidor:",
      res.rows[0].now,
    );
  } catch (err) {
    console.error("❌ Erro de conexão com o Neon:", err);
  }
})();

// ==============================
// ERRO GLOBAL DO POOL
// ==============================
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

export default pool;
