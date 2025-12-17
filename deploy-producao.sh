#!/bin/bash
echo "íº€ CONFIGURANDO Ã“TICA CDO PARA PRODUÃ‡ÃƒO"
echo "========================================"

# 1. Atualizar backend
cd backend
echo "í´„ Atualizando backend..."
npm install

# 2. Configurar .env se nÃ£o existir
if [ ! -f .env ]; then
  echo "í³ Criando arquivo .env de exemplo..."
  cat > .env << 'ENVEOF'
PORT=3001
NODE_ENV=production
# GEMINI_API_KEY=sua_chave_aqui  # Opcional - deixe comentado se nÃ£o tem
CORS_ORIGIN=https://marcelogomes-dev.github.io
ENVEOF
  echo "âš ï¸  IMPORTANTE: Edite backend/.env para adicionar sua chave Gemini (opcional)"
fi

# 3. Iniciar backend local para teste
echo "í´§ Iniciando backend localmente (Ctrl+C para parar)..."
npm run dev
