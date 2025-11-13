# 🤖 WhatsApp SaaS com Inteligência Artificial 💬

![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT-4o-mini-blue?logo=openai)
![License](https://img.shields.io/badge/License-MIT-yellow)

Este é um projeto de **chatbot para WhatsApp**, desenvolvido com **Node.js**, **whatsapp-web.js** e **OpenAI GPT**.  

É meu **segundo projeto de chatbot**, mas o **primeiro utilizando IA**, proporcionando respostas mais naturais e contextuais para pequenos negócios. 🚀

---

## 🌟 Funcionalidades

- 💬 Respostas automáticas via **OpenAI GPT-4o-mini**  
- 🗂 Histórico de conversas por cliente  
- 🛠 Contexto personalizado por cliente (ex.: horários, cardápio, promoções)  
- 🔔 Filtragem de mensagens para evitar spam  
- 🎉 Boas-vindas automáticas e menus interativos  
- ⏱ Fila de envio de mensagens com delay  
- 📊 Logs detalhados e rotacionados  

---

## 🗂 Estrutura do projeto

bot/ # Código do bot
bot/clientes/ # JSONs de configuração por cliente
bot/instances/ # Sessões locais do WhatsApp
bot/qrcodes/ # QR Codes gerados para login inicial
logs/ # Logs de execução
package.json # Dependências e scripts
.env # Variáveis de ambiente
.gitignore # Arquivos/pastas ignorados





---

## ⚙️ Pré-requisitos

- Node.js >= 20  
- npm ou yarn  
- Conta OpenAI e chave de API configurada no `.env`  
- Chrome/Chromium (para whatsapp-web.js)  

---

## 💻 Instalação

1. Clone o repositório:
```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd whatsapp-saas

git clone https://github.com/TinRober/whatsapp-saas.git
cd whatsapp-saas
Instale as dependências:
npm install
# ou
yarn install

Crie o arquivo .env com as variáveis:
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4o-mini

Inicie o bot:
node bot/index.js --id=Cliente1
O QR Code será gerado no primeiro acesso para autenticação.

Sessões são salvas automaticamente para reconexões futuras. 🔑

🚀 Próximos passos
Subir o bot para AWS Lightsail para execução contínua ☁️

Integrar com a API oficial do WhatsApp para reduzir dependência do Chromium 📱

Monitoramento do uso da API e consumo de tokens 📊

📌 Observações
Pastas como chrome-win/ e sessões do WhatsApp estão no .gitignore

Logs são rotacionados diariamente para evitar crescimento excessivo

Ideal para pequenas empresas, quadras, bares e serviços locais

Não versionar node_modules/ nem arquivos .env

✉️ Contato
Desenvolvido por Roberto Galarani
Email: galarani.dev@gmail.com



