# 📦 Manual de Instalação - Aplicativo Front-End (Tauri) + Criação de Usuários

Este guia explica como configurar e instalar o front-end do sistema jurídico utilizando Tauri, além de instruções para criar usuários no back-end via API.

---

## ✅ Pré-requisitos

1. **Computador com Windows 10 ou superior**  
2. **Aplicativo Back-End já rodando no servidor**

---

## 🛠️ Passo a passo - Front-End

### 1. Editar o arquivo `.env`

Abra o projeto do front-end e edite o arquivo `.env`:

```env
VITE_API_URL=http://IP_DO_SERVIDOR:3000
Substitua IP_DO_SERVIDOR pelo IP fixo da máquina onde está rodando o back-end.

Exemplo:

env
Copiar
Editar
VITE_API_URL=http://192.168.0.100:3000
2. Build com Tauri
No terminal, dentro da pasta do projeto do front-end, rode:

bash
Copiar
Editar
npx tauri build
Isso irá gerar o instalador .msi na pasta:

bash
Copiar
Editar
src-tauri/target/release/bundle/msi/
3. Instalar o Aplicativo
Copie o arquivo .msi gerado para o computador do cliente e execute-o para instalar o aplicativo.

Após a instalação, o atalho será adicionado ao Menu Iniciar automaticamente.

🧪 Teste de Comunicação
Após instalar, abra o sistema no computador do cliente. Se o IP e porta estiverem corretos, ele se comunicará com o servidor normalmente.

💡 Dica Extra: Comunicação na Rede
Certifique-se de que:

O servidor esteja com IP fixo configurado

A porta 3000 esteja liberada no firewall do servidor

Os computadores estejam na mesma rede

🔐 Criação, Edição e Autenticação de Usuários via API
Endpoints
Método	Rota	Descrição
POST	/login/create	Criar novo usuário
PUT	/login/:id	Atualizar usuário por ID
DELETE	/login/:id	Deletar usuário por ID
POST	/login	Autenticar usuário (login)

1. Criar Usuário (POST /login/create)
URL: http://IP_DO_SERVIDOR:3000/login/create

Body (JSON):

json
Copiar
Editar
{
  "username": "nomeusuario",
  "senha": "senha123",
  "role": "PROPRIETARIO",
  "auth": "todeschini"
}
Observação: O campo auth é a senha de administração (fixa, ex: "todeschini"). Sem ela, não será possível criar ou modificar usuários.

2. Editar Usuário (PUT /login/:id)
URL: http://IP_DO_SERVIDOR:3000/login/ID_DO_USUARIO

Body (JSON):

json
Copiar
Editar
{
  "username": "novoNomeUsuario",
  "senha": "novaSenha",          // opcional
  "role": "FUNCIONARIO",         // opcional
  "auth": "todeschini"
}
3. Deletar Usuário (DELETE /login/:id)
URL: http://IP_DO_SERVIDOR:3000/login/ID_DO_USUARIO

Body (JSON):

json
Copiar
Editar
{
  "auth": "todeschini"
}
4. Autenticar Usuário (POST /login)
URL: http://IP_DO_SERVIDOR:3000/login

Body (JSON):

json
Copiar
Editar
{
  "username": "nomeusuario",
  "senha": "senha123"
}
Resposta:

json
Copiar
Editar
{
  "role": "BACKUP"
}
📝 Exemplo para Postman
Abra o Postman

Crie uma nova requisição

Selecione o método HTTP (POST, PUT, DELETE)

Cole a URL da API (http://IP_DO_SERVIDOR:3000/login/create por exemplo)

Na aba Body, selecione raw e o tipo JSON

Cole o JSON conforme o exemplo acima

Clique em Send para executar

✅ Pronto! Com essas instruções você pode configurar o front-end, instalar o aplicativo e administrar os usuários via API.



