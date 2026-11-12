const fs = require('node:fs');
const path = require('node:path');
const Database = require('better-sqlite3');

const dbPath = process.env.DB_PATH || path.join(process.cwd(), 'data', 'sifra.db');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');
db.exec(`
CREATE TABLE IF NOT EXISTS familias (id INTEGER PRIMARY KEY, nome TEXT NOT NULL, comunidade TEXT NOT NULL, municipio TEXT NOT NULL, mulher INTEGER NOT NULL, caf TEXT NOT NULL, cpf_ok INTEGER NOT NULL, sican_ok INTEGER NOT NULL, pix_ok INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS vendas (id INTEGER PRIMARY KEY, lote TEXT UNIQUE NOT NULL, familia_id INTEGER NOT NULL REFERENCES familias(id), produto TEXT NOT NULL, kg REAL NOT NULL, preco_kg REAL NOT NULL, valor REAL NOT NULL, comprador TEXT NOT NULL, canal TEXT NOT NULL, nota TEXT NOT NULL, nota_numero TEXT, subvencao REAL NOT NULL DEFAULT 0, criado_em TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS pendencias (id INTEGER PRIMARY KEY, familia_id INTEGER NOT NULL REFERENCES familias(id), tipo TEXT NOT NULL, descricao TEXT NOT NULL, avisado INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS regras (id INTEGER PRIMARY KEY, slug TEXT NOT NULL, produto TEXT NOT NULL, prefixo_lote TEXT NOT NULL, vigencia INTEGER NOT NULL, preco_referencia REAL NOT NULL, fonte_preco TEXT NOT NULL, preco_minimo REAL, subvencao_kg REAL, observacao TEXT);
CREATE TABLE IF NOT EXISTS config (chave TEXT PRIMARY KEY, valor TEXT);
`);
module.exports = db;
