  
# 📦 Manual de Instalação - Aplicativo Front-End (Tauri)

Este guia explica como configurar e instalar o front-end do sistema jurídico utilizando Tauri.

---

## ✅ Pré-requisitos

1. **Computador com Windows 10 ou superior**
2. **Aplicativo Back-End já rodando no servidor**

---

## 🛠️ Passo a passo

### 1. Editar o arquivo `.env`

Abra o projeto do front-end e edite o arquivo `.env`:

```env
VITE_API_URL=http://IP_DO_SERVIDOR:3000
```

> Substitua `IP_DO_SERVIDOR` pelo IP fixo da máquina onde está rodando o back-end.

Exemplo:

```env
VITE_API_URL=http://192.168.0.100:3000
```

---

### 2. Build com Tauri

No terminal, dentro da pasta do projeto do front-end, rode:

```bash
npm run tauri build
```

Isso irá gerar o instalador `.msi` na pasta:

```bash
src-tauri/target/release/bundle/msi/
```

---

### 3. Instalar o Aplicativo

Copie o arquivo `.msi` gerado para o computador do cliente e execute-o para instalar o aplicativo.

Após a instalação, o atalho será adicionado ao Menu Iniciar automaticamente.

---

## 🧪 Teste de Comunicação

Após instalar, abra o sistema no computador do cliente. Se o IP e porta estiverem corretos, ele se comunicará com o servidor normalmente.

---

## 💡 Dica Extra: Comunicação na Rede

Certifique-se de que:

- O servidor esteja com IP fixo configurado
- A porta 3000 esteja liberada no firewall do servidor
- Os computadores estejam na mesma rede

---

✅ **Pronto!** O sistema já está instalado e conectado ao servidor back-end.
