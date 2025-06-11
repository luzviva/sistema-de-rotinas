# 💡 Dicas para Usar o Render

## ⚡ Performance
- **Primeiro acesso**: Pode demorar 30-60 segundos (serviço "acordando")
- **Acessos subsequentes**: Rápidos enquanto ativo
- **Inatividade**: Serviço "dorme" após 15 minutos

## 🔧 Monitoramento
- **Logs**: Disponíveis em tempo real no dashboard
- **Métricas**: CPU, memória e requests
- **Status**: Verde = ativo, Cinza = dormindo

## 🗄️ Banco de Dados
- **Backup**: Automático no plano gratuito
- **Conexões**: Máximo 97 conexões simultâneas
- **Storage**: 1GB gratuito

## 🚀 Deploy
- **Automático**: Conectado ao GitHub
- **Manual**: Botão "Manual Deploy" no dashboard
- **Rollback**: Possível via dashboard

## 💰 Limites do Plano Gratuito
- 750 horas/mês (suficiente para uso pessoal)
- 1GB PostgreSQL storage
- 1 milhão de linhas no banco
- Serviço dorme após inatividade

## 🔄 Manter Ativo
Para evitar que o serviço durma:
- Use regularmente (pelo menos uma vez por dia)
- Configure um monitor externo (UptimeRobot, etc.)
- Acesse via smartphone ocasionalmente
