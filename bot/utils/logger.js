/**
 * Logger com Winston + Rotação de Logs
 * - Cria diretório "logs" se não existir.
 * - Rotaciona arquivos diariamente (ou por tamanho).
 * - Mantém histórico limitado para evitar crescimento infinito.
 */

const fs = require("fs");
const path = require("path");
const winston = require("winston");
require("winston-daily-rotate-file"); // Plugin para rotação de logs

// Caminho do diretório de logs
const logDir = path.join(process.cwd(), "logs");

// Cria diretório "logs" caso não exista
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

/**
 * Transport para rotação diária:
 * - Cria um arquivo por dia (ex.: app-2025-11-12.log)
 * - Compacta arquivos antigos (.gz)
 * - Limita tamanho e quantidade de arquivos
 */
const rotateTransport = new winston.transports.DailyRotateFile({
  dirname: logDir,                // Diretório dos logs
  filename: "app-%DATE%.log",     // Nome do arquivo com data
  datePattern: "YYYY-MM-DD",      // Rotação diária
  zippedArchive: true,            // Compacta arquivos antigos
  maxSize: "10m",                 // Tamanho máximo por arquivo
  maxFiles: "7d"                  // Mantém 7 dias de histórico
});

/**
 * Transport separado para erros:
 * - Também rotaciona diariamente
 * - Apenas nível "error"
 */
const errorRotateTransport = new winston.transports.DailyRotateFile({
  dirname: logDir,
  filename: "error-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "5m",
  maxFiles: "14d",                // Mantém 14 dias para erros
  level: "error"
});

// Configuração do logger principal
const logger = winston.createLogger({
  level: "info", // Nível padrão
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
  ),
  transports: [
    new winston.transports.Console(), // Exibe logs no console
    rotateTransport,                  // Rotação para logs gerais
    errorRotateTransport              // Rotação para erros
  ]
});

/**
 * Função para registrar mensagens detalhadas (entrada/saída).
 * @param {string} type - Tipo da mensagem: RECEIVED ou SENT
 * @param {string} number - Número do contato
 * @param {string} text - Texto da mensagem
 */
function logMessage(type, number, text) {
  logger.info(`${type} | ${number} | ${text}`);
}

module.exports = { logger, logMessage };
