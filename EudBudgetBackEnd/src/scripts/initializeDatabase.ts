import createDBConnection from "../config/database";

async function initializeDatabase() {
  const db = await createDBConnection();

  await db.exec(`
    CREATE TABLE IF NOT EXISTS cliente (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      telefone TEXT,
      endereco TEXT
    );

    CREATE TABLE IF NOT EXISTS servico (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      valor REAL,
      clienteId INTEGER,
      FOREIGN KEY(clienteId) REFERENCES cliente(id)
    );
  `);

  console.log("Banco de dados inicializado com sucesso.");
}

initializeDatabase().catch((err) => {
  console.error("Erro ao inicializar o banco de dados:", err);
});
