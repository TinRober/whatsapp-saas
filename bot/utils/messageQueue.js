/**
 * Fila simples para enviar mensagens com delay.
 */
const queue = [];
let isProcessing = false;

function addToQueue(client, to, message, delay = 2000) {
  queue.push({ client, to, message, delay });
  processQueue();
}

async function processQueue() {
  if (isProcessing || queue.length === 0) return;
  isProcessing = true;
  const { client, to, message, delay } = queue.shift();
  await new Promise(resolve => setTimeout(resolve, delay));
  await client.sendMessage(to, message);
  isProcessing = false;
  processQueue();
}

module.exports = { addToQueue };