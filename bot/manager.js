/**
 * Gerencia instâncias do WhatsApp SaaS.
 * - Cada cliente tem pasta própria de sessão
 * - Gera QR Codes e integra com OpenAI
 * - Evita flood usando controle de sessão e fila com delay
 * - Gera logs rotacionados
 */

const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcodeTerminal = require("qrcode-terminal");
const qrcodeImage = require("qrcode");
const fs = require("fs");
const path = require("path");

const { logger, logMessage } = require("./utils/logger.js");
const { responderComIA } = require("./utils/openai.js");
const { addToQueue } = require("./utils/messageQueue.js");
const { podeResponder, registrarMensagem } = require("./utils/sessionManager.js");

// Diretórios
const qrDir = path.join(__dirname, "qrcodes");
if (!fs.existsSync(qrDir)) fs.mkdirSync(qrDir, { recursive: true });

const clientesDir = path.join(process.cwd(), "bot", "clientes");
if (!fs.existsSync(clientesDir)) fs.mkdirSync(clientesDir, { recursive: true });

// Caminho do Chromium (pode vir do .env)
const chromiumPath = process.env.CHROME_PATH || "/usr/bin/chromium-browser";

/**
 * Inicia uma instância individual do WhatsApp
 */
async function iniciarCliente(clienteId) {
  try {
    logger.info(`🟡 Iniciando cliente ${clienteId}...`);

    // Pasta de sessão do cliente
    const sessionPath = path.join(__dirname, `instances/${clienteId}/session-${clienteId}`);
    if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath, { recursive: true });

    const client = new Client({
      authStrategy: new LocalAuth({ clientId: clienteId, dataPath: sessionPath }),
      puppeteer: {
        headless: true,
        executablePath: chromiumPath,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--disable-software-rasterizer"
        ]
      }
    });

    // QR Code
    client.on("qr", async qr => {
      qrcodeTerminal.generate(qr, { small: true });
      const qrPath = path.join(qrDir, `qrcode-${clienteId}.png`);
      try {
        await qrcodeImage.toFile(qrPath, qr);
        logger.info(`✅ QR gerado e salvo em ${qrPath}`);
      } catch (err) {
        logger.error(`Erro ao salvar QR para ${clienteId}: ${err.message}`);
      }
    });

    // Quando cliente estiver pronto
    client.on("ready", () => {
      logger.info(`✅ Cliente ${clienteId} conectado com sucesso!`);

      const configPath = path.join(clientesDir, `${clienteId}.json`);
      let clienteConfig = {};
      if (fs.existsSync(configPath)) {
        try {
          clienteConfig = JSON.parse(fs.readFileSync(configPath));
        } catch (err) {
          logger.error(`Erro ao ler configuração de ${clienteId}: ${err.message}`);
        }
      }

      client.boasVindas = clienteConfig.mensagemBoasVindas || "Olá! Como posso ajudá-lo?";
      client.firstMessageSent = {}; // controla flood por contato
    });

    // Mensagens recebidas
    client.on("message", async msg => {
      try {
        if (msg.from.includes("@g.us") || msg.fromMe) return;
        if (!podeResponder(msg.from)) return;

        registrarMensagem(msg.from);
        logMessage("RECEIVED", msg.from, msg.body);

        const contato = msg.from;
        const texto = msg.body.trim();

        if (!client.firstMessageSent[contato]) {
          await client.sendMessage(contato, client.boasVindas);
          logMessage("SENT", contato, client.boasVindas);
          client.firstMessageSent[contato] = true;
          logger.info(`Mensagem de boas-vindas enviada para ${contato}`);
        }

        if (!process.env.OPENAI_API_KEY) {
          await client.sendMessage(contato, "🤖 Sistema de IA não configurado.");
          return;
        }

        const resposta = await responderComIA(clienteId, texto);
        addToQueue(client, contato, resposta, 2500);
        logMessage("SENT", contato, resposta);

      } catch (error) {
        logger.error(`Erro ao processar mensagem (${clienteId}): ${error.message}`);
      }
    });

    await client.initialize();

  } catch (err) {
    logger.error(`Falha ao iniciar cliente ${clienteId}: ${err.message}`);
  }
}

/**
 * Inicia o gerenciador principal para todos os clientes
 */
function iniciarGerenciador() {
  const clientes = fs.readdirSync(clientesDir).filter(file => file.endsWith(".json"));

  if (clientes.length === 0) {
    logger.warn("Nenhum cliente encontrado. Adicione arquivos JSON em bot/clientes/");
    return;
  }

  logger.info(`🚀 Iniciando ${clientes.length} cliente(s)...`);
  clientes.forEach(file => {
    const clienteId = path.basename(file, ".json");
    iniciarCliente(clienteId);
  });
}

module.exports = { iniciarCliente, iniciarGerenciador };
