/**
 * Gerencia sessões para evitar spam e controlar pausas entre respostas.
 */
const sessions = new Map();
const TEMPO_PAUSA = 5000; // 5 segundos entre respostas

function podeResponder(numero) {
  const ultimaMensagem = sessions.get(numero);
  const agora = Date.now();
  return !ultimaMensagem || (agora - ultimaMensagem > TEMPO_PAUSA);
}

function registrarMensagem(numero) {
  sessions.set(numero, Date.now());
}

module.exports = { podeResponder, registrarMensagem };
