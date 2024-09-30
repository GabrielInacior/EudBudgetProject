import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

let db: Database | null = null;

async function createDBConnection(): Promise<Database> {
  if (!db) {
    db = await open({
      filename: "./database.db",
      driver: sqlite3.Database,
    });
  }
  return db;
}

export default createDBConnection;
