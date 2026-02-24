# relatorios_moviment

# 🚐 Sistema de Controle de Movimentação - Bel-tour

Sistema desenvolvido para gestão de movimentação de vans e motoristas, com integração em tempo real e painel administrativo.

## 🚀 Tecnologias
* **Frontend:** HTML5, CSS3 (Dark Design), JavaScript.
* **Backend:** Vercel Serverless Functions (Node.js).
* **Banco de Dados:** Vercel KV (Redis).
* **Hospedagem:** Vercel.

## 📁 Estrutura do Repositório
* `index.html`: Interface principal para os motoristas gerarem relatórios.
* `admin.html`: Painel restrito para gestão de usuários e visualização de logs.
* `motoristas.js`: Banco de dados legado (estático).
* `/api/gerenciar.js`: API de conexão com o banco de dados Vercel KV.
* `package.json`: Dependências do projeto.

## 🛠️ Configuração
Para o funcionamento correto, é necessário conectar um **Storage KV** ao projeto no painel da Vercel para habilitar o registro de logs e novos motoristas.

---
*Desenvolvido por TiagoAraujo.*
