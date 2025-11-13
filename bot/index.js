/**
 * Ponto de entrada do sistema WhatsApp SaaS.
 * -------------------------------------------------------
 * - Carrega variáveis de ambiente do .env
 * - Verifica se deve rodar em modo cliente único ou múltiplos clientes
 * - Inicia o gerenciador central de bots
 */

require("dotenv").config();
const path = require("path");

// Importa as funções do gerenciador
const { iniciarGerenciador, iniciarCliente } = require("./manager.js");

// Identifica o cliente passado como argumento (--id=Cliente1)
const argCliente = process.argv.find(arg => arg.startsWith("--id="));
const clienteId = argCliente ? argCliente.split("=")[1] : null;

if (clienteId) {
  console.log(`🔹 Iniciando cliente único: ${clienteId}`);
  iniciarCliente(clienteId);
} else {
  console.log("🚀 Iniciando gerenciador para todos os clientes...");
  iniciarGerenciador();
}