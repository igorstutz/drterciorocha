#!/usr/bin/env node
// Gera a entrada de uma pessoa para ADMIN_USUARIOS (login do painel /admin). A senha não fica
// escrita em lugar nenhum: só o sal e o hash vão para o .env.
//
//   node scripts/senha-painel.mjs marketing@clinicaterciorocha.com.br
//
// Várias pessoas: junte as entradas com vírgula — ADMIN_USUARIOS=entrada1,entrada2
import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline/promises";

const email = (process.argv[2] ?? "").trim().toLowerCase();
if (!/^[^\s@:,]+@[^\s@:,]+$/.test(email)) {
  console.error("Uso: node scripts/senha-painel.mjs email@dominio.com");
  process.exit(1);
}

const rl = createInterface({ input: process.stdin, output: process.stdout });
const senha = await rl.question("Senha (mínimo 10 caracteres): ");
rl.close();
if (senha.length < 10) {
  console.error("Senha curta demais.");
  process.exit(1);
}

const sal = randomBytes(16).toString("hex");
const hash = scryptSync(senha, sal, 32).toString("hex");
console.log(`\n${email}:${sal}:${hash}\n`);
