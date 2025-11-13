# WhatsApp SaaS com Inteligência Artificial 🤖💬

Este é um projeto de chatbot para WhatsApp, desenvolvido com **Node.js**, **whatsapp-web.js** e **OpenAI GPT**, pensado para pequenas empresas, lojas e serviços locais.  

É meu **segundo projeto de chatbot**, mas o **primeiro utilizando IA**, com respostas automáticas mais naturais e contextuais.  

---

## Funcionalidades ✨

- Respostas automáticas via **OpenAI GPT-4o-mini**  
- Histórico de conversas por cliente  
- Contexto personalizado por cliente (ex.: horários, cardápio, promoções)  
- Filtragem de mensagens, evitando spam e mensagens duplicadas  
- Boas-vindas automáticas e menus interativos  
- Fila de envio de mensagens com delay para simular comportamento humano  
- Logs detalhados e rotacionados para monitoramento do bot  

---

## Estrutura do projeto 🗂️

bot/ # Código do bot
bot/clientes/ # JSONs de configuração por cliente
bot/instances/ # Sessões locais do WhatsApp
bot/qrcodes/ # QR Codes gerados para login inicial
logs/ # Logs de execução
package.json # Dependências e scripts
.env # Variáveis de ambiente
.gitignore # Arquivos/pastas ignorados

---

## Pré-requisitos ⚙️

- Node.js >= 20  
- npm ou yarn  
- Conta OpenAI e chave de API configurada no `.env`  
- Chrome/Chromium (para whatsapp-web.js)  

---

## Instalação 💻

1. Clone o repositório:
```bash
git clone https://github.com/TinRober/whatsapp-saas.git
cd whatsapp-saas
Instale as dependências:

bash
Copiar código
npm install
# ou
yarn install
Crie o arquivo .env com as variáveis necessárias:

ini
Copiar código
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4o-mini

bash
Como uniciar o bot

para iniciar somente um cliente:
node bot/index.js --id=Cliente1

para iniciar todos:
pm2 start npm -- start

No primeiro acesso, o QR Code será gerado para autenticação no WhatsApp.

Após isso, as sessões são salvas automaticamente para reconexões futuras.

Próximos passos 🚀
Subir o bot para AWS Lightsail para execução contínua

Avaliar integração com a API oficial do WhatsApp para reduzir dependência do Chromium

Monitoramento de uso da API e consumo de tokens

Observações 📌
A pasta chrome-win/ e sessões do WhatsApp são ignoradas no GitHub (.gitignore)

Logs são rotacionados diariamente para evitar crescimento excessivo

Ideal para pequenas empresas, quadras, bares e serviços locais


Contato ✉️
Desenvolvido por Roberto Galarani
Email: galarani.dev@gmail.com

