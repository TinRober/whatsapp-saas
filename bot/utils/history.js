/**
 * Gerencia histórico de conversas por sessão.
 * - Salva mensagens em arquivos JSON.
 * - Mantém apenas as últimas 10 mensagens.
 */
const fs = require("fs");
const path = require("path");

const historyDir = path.join(process.cwd(), "instances", "history");
if (!fs.existsSync(historyDir)) {
  fs.mkdirSync(historyDir, { recursive: true });
}

function getHistoryFile(sessionId) {
  return path.join(historyDir, `${sessionId}.json`);
}

function addMessage(sessionId, role, content) {
  const file = getHistoryFile(sessionId);
  let data = [];
  if (fs.existsSync(file)) {
    data = JSON.parse(fs.readFileSync(file));
  }
  data.push({ role, content, timestamp: new Date().toISOString() });
  if (data.length > 10) data.shift();
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function getHistory(sessionId) {
  const file = getHistoryFile(sessionId);
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : [];
}

module.exports = { addMessage, getHistory };