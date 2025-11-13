/**
 * Integração com OpenAI API usando histórico e contexto por cliente.
 * - Usa GPT-4o-mini (ajustável via .env)
 * - Mantém histórico de mensagens
 * - Lê contexto personalizado de bot/clientes/<clienteId>.json
 * - Adiciona logs detalhados para debug
 */

const { OpenAI } = require("openai");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

const { getHistory, addMessage } = require("./history.js");
const { logger } = require("./logger.js"); // ✅ já corrigido com { }

dotenv.config();

const clientesDir = path.join(process.cwd(), "bot", "clientes");

async function responderComIA(sessionId, mensagem) {
  try {
    // 🔹 Cria nova instância OpenAI por chamada
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // 🔹 1. Log da mensagem recebida
    logger.info(`🤖 [${sessionId}] Mensagem recebida: ${mensagem}`);

    // 🔹 2. Lê o contexto do arquivo JSON do cliente (se existir)
    let contextoIA = "Você é um assistente útil, educado e profissional.";

    const clienteConfigPath = path.join(clientesDir, `${sessionId}.json`);
    if (fs.existsSync(clienteConfigPath)) {
      const data = JSON.parse(fs.readFileSync(clienteConfigPath));
      if (data.contextoIA) contextoIA = data.contextoIA;
    }

    logger.info(`🤖 [${sessionId}] Contexto usado: ${contextoIA}`);

    // 🔹 3. Recupera histórico de conversa
    const history = getHistory(sessionId);
    logger.info(`🤖 [${sessionId}] Histórico atual: ${JSON.stringify(history)}`);

    const messages = [
      { role: "system", content: contextoIA },
      ...history,
      { role: "user", content: mensagem }
    ];

    // 🔹 4. Chama a API da OpenAI
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages,
      temperature: 0.7
    });

    // 🔹 5. Processa e registra a resposta
    const resposta = response.choices[0].message.content.trim();
    addMessage(sessionId, "user", mensagem);
    addMessage(sessionId, "assistant", resposta);

    logger.info(`🤖 [${sessionId}] IA respondeu: ${resposta}`);
    return resposta;

  } catch (error) {
    // 🔹 Log detalhado do erro
    logger.error(`❌ Erro ao gerar resposta com IA para ${sessionId}: ${error.message}`);
    logger.error(error.stack); // Stack trace completo
    return "Desculpe, ocorreu um erro ao processar sua mensagem.";
  }
}

module.exports = { responderComIA };
