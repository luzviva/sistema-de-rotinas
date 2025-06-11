# 🚀 Guia de Deploy - Sistema de Rotina com Recompensas (Render)

## 📋 Visão Geral do Deploy

Este guia te ajudará a colocar o sistema online usando:
- **GitHub** como repositório principal
- **GitHub Pages** para hospedar o frontend
- **Render** (gratuito) para hospedar o backend
- **PostgreSQL** (gratuito) como banco de dados

## 🎯 Passo a Passo Completo

### 1. 📁 Preparar o Repositório no GitHub

#### 1.1 Criar Repositório
1. Acesse [GitHub.com](https://github.com)
2. Clique em "New repository"
3. Nome sugerido: `sistema-rotina-recompensas`
4. Marque como **Público** (necessário para GitHub Pages gratuito)
5. Clique em "Create repository"

#### 1.2 Upload dos Arquivos

**Opção A: Upload Direto (Mais Simples)**
1. Descompacte o arquivo `sistema-rotina-recompensas.zip`
2. No seu repositório GitHub, clique em "uploading an existing file"
3. Arraste todos os arquivos e pastas para a área de upload
4. Escreva uma mensagem de commit: "Initial commit - Sistema de Rotina"
5. Clique em "Commit changes"

**Opção B: Usando Git (Recomendado)**
```bash
# Clone o repositório vazio
git clone https://github.com/SEU_USUARIO/sistema-rotina-recompensas.git
cd sistema-rotina-recompensas

# Copie todos os arquivos do projeto para esta pasta
# (rotina-frontend/, rotina-recompensas/, .github/, README.md, etc.)

# Adicione os arquivos
git add .
git commit -m "Initial commit - Sistema de Rotina com Recompensas"
git push origin main
```

### 2. 🌐 Configurar GitHub Pages (Frontend)

#### 2.1 Habilitar GitHub Pages
1. No seu repositório, vá em **Settings**
2. Role até **Pages** no menu lateral
3. Em **Source**, selecione **GitHub Actions**
4. Salve as configurações

#### 2.2 Configurar Secrets
1. Vá em **Settings** > **Secrets and variables** > **Actions**
2. Clique em **New repository secret**
3. Adicione:
   - **Nome:** `REACT_APP_API_URL`
   - **Valor:** `https://SEU-BACKEND.onrender.com` (será definido no passo 3)

### 3. ⚡ Deploy do Backend no Render

#### 3.1 Criar Conta no Render
1. Acesse [Render.com](https://render.com)
2. Clique em "Get Started for Free"
3. Faça login com sua conta GitHub
4. Autorize o Render a acessar seus repositórios

#### 3.2 Criar Web Service
1. No dashboard do Render, clique em **New +**
2. Selecione **Web Service**
3. Conecte seu repositório `sistema-rotina-recompensas`
4. Clique em **Connect**

#### 3.3 Configurar o Web Service
Preencha os campos:

- **Name:** `sistema-rotina-backend` (ou nome de sua escolha)
- **Region:** `Oregon (US West)` (mais próximo do Brasil)
- **Branch:** `main`
- **Root Directory:** `rotina-recompensas`
- **Runtime:** `Python 3`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `cd src && gunicorn main:app --bind 0.0.0.0:$PORT --workers 2`

#### 3.4 Configurar Variáveis de Ambiente
Na seção **Environment Variables**, adicione:

```env
FLASK_ENV=production
SECRET_KEY=sua-chave-secreta-super-segura-aqui-123456789
PORT=10000
HOST=0.0.0.0
CORS_ORIGINS=https://SEU_USUARIO.github.io
TIMEZONE=America/Sao_Paulo
```

#### 3.5 Configurar Plano
- Selecione **Free** (gratuito)
- Clique em **Create Web Service**

### 4. 🗄️ Configurar Banco PostgreSQL

#### 4.1 Criar Banco no Render
1. No dashboard do Render, clique em **New +**
2. Selecione **PostgreSQL**
3. Preencha:
   - **Name:** `sistema-rotina-db`
   - **Database:** `rotina_db`
   - **User:** `rotina_user`
   - **Region:** `Oregon (US West)` (mesma do backend)
4. Selecione **Free** (gratuito)
5. Clique em **Create Database**

#### 4.2 Obter URL de Conexão
1. Após criar o banco, vá na aba **Info**
2. Copie a **Internal Database URL** (formato: `postgresql://...`)

#### 4.3 Adicionar URL ao Backend
1. Volte ao seu Web Service (backend)
2. Vá em **Environment**
3. Adicione nova variável:
   - **Key:** `DATABASE_URL`
   - **Value:** Cole a URL do banco PostgreSQL
4. Clique em **Save Changes**

### 5. 🔗 Conectar Frontend e Backend

#### 5.1 Obter URL do Backend
1. No Render, vá ao seu Web Service
2. Copie a URL (ex: `https://sistema-rotina-backend.onrender.com`)
3. Teste acessando: `https://sua-url.onrender.com/health`

#### 5.2 Atualizar Secret do GitHub
1. Volte ao GitHub > **Settings** > **Secrets**
2. Edite `REACT_APP_API_URL`
3. Cole a URL do Render: `https://sua-url.onrender.com`

#### 5.3 Atualizar CORS no Render
1. No Render, edite a variável `CORS_ORIGINS`
2. Valor: `https://SEU_USUARIO.github.io/sistema-rotina-recompensas`

### 6. 🎉 Deploy Automático

#### 6.1 Trigger do Deploy
1. Faça qualquer alteração no código
2. Commit e push para o GitHub:
```bash
git add .
git commit -m "Configure for production with Render"
git push origin main
```

#### 6.2 Acompanhar Deploy
1. **GitHub Actions**: Vá em **Actions** no GitHub para ver o build do frontend
2. **Render**: Vá no painel do Render para ver o deploy do backend

### 7. 🌍 Acessar o Sistema Online

Após os deploys concluírem:

- **Frontend**: `https://SEU_USUARIO.github.io/sistema-rotina-recompensas`
- **Backend**: `https://sua-url.onrender.com`
- **API Health**: `https://sua-url.onrender.com/health`

## 🔧 Configurações Avançadas

### Domínio Personalizado (Opcional)
1. No GitHub Pages, configure um domínio personalizado
2. Atualize as variáveis CORS no Render

### Monitoramento
- **Render**: Painel com logs e métricas
- **GitHub**: Actions para histórico de deploys

### Backup do Banco
1. No Render, vá ao seu banco PostgreSQL
2. Use a aba **Backups** para criar backups manuais

## 🆘 Solução de Problemas

### Frontend não carrega
1. Verifique se o GitHub Actions executou com sucesso
2. Confirme se o GitHub Pages está habilitado
3. Teste a URL: `https://SEU_USUARIO.github.io/sistema-rotina-recompensas`

### Backend não responde
1. Verifique logs no Render (aba **Logs**)
2. Teste health check: `https://sua-url.onrender.com/health`
3. Confirme variáveis de ambiente
4. **Importante**: O plano gratuito do Render "dorme" após 15 minutos de inatividade. O primeiro acesso pode demorar 30-60 segundos para "acordar"

### CORS Error
1. Verifique se `CORS_ORIGINS` no Render está correto
2. URL deve ser exata: `https://SEU_USUARIO.github.io/sistema-rotina-recompensas`

### Banco de dados não conecta
1. Verifique se PostgreSQL está rodando no Render
2. Confirme se `DATABASE_URL` está definida corretamente
3. Veja logs de erro no Render

### Deploy falha no Render
1. Verifique se o `requirements.txt` está correto
2. Confirme se o `Start Command` está: `cd src && gunicorn main:app --bind 0.0.0.0:$PORT --workers 2`
3. Veja logs detalhados na aba **Logs**

## 📊 Custos e Limites

### Gratuito:
- ✅ GitHub (repositório público)
- ✅ GitHub Pages (frontend)
- ✅ Render Web Service (750 horas/mês grátis)
- ✅ PostgreSQL Render (1GB storage, 1 milhão de linhas)

### Limites:
- **Render**: 750 horas/mês (suficiente para uso pessoal)
- **Render**: Serviço "dorme" após 15 min de inatividade
- **GitHub Pages**: 100GB bandwidth/mês
- **PostgreSQL**: 1GB storage, 1 milhão de linhas

### Dicas para Otimizar o Uso:
- O serviço "dorme" no plano gratuito, mas acorda rapidamente
- Use o sistema regularmente para manter ativo
- Monitore uso na dashboard do Render

## 🔄 Atualizações Futuras

Para atualizar o sistema:
1. Faça alterações no código local
2. Commit e push para GitHub
3. **Frontend**: Deploy automático via GitHub Actions
4. **Backend**: Deploy automático no Render (conectado ao GitHub)

## 📞 Suporte

Se encontrar problemas:
1. Verifique logs no Render (aba **Logs**)
2. Veja Actions no GitHub
3. Teste endpoints da API: `https://sua-url.onrender.com/health`
4. Confirme variáveis de ambiente no Render

## 🎯 Checklist Final

- [ ] Repositório criado no GitHub
- [ ] Arquivos enviados para o repositório
- [ ] GitHub Pages habilitado
- [ ] Secret `REACT_APP_API_URL` configurado
- [ ] Web Service criado no Render
- [ ] Banco PostgreSQL criado no Render
- [ ] Variáveis de ambiente configuradas no Render
- [ ] `DATABASE_URL` adicionada ao backend
- [ ] CORS configurado corretamente
- [ ] Frontend acessível via GitHub Pages
- [ ] Backend respondendo no Render
- [ ] API health check funcionando

---

**🎉 Parabéns! Seu sistema estará online e acessível de qualquer lugar!**

**Render vs Railway**: O Render oferece um plano gratuito mais generoso para aplicações web, sendo uma excelente alternativa ao Railway para projetos pessoais.

