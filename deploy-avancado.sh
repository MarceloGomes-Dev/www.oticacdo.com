#!/bin/bash
echo "Ì∫Ä DEPLOY AVAN√áADO - √ìTICA CDO IA"
echo "=================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fun√ß√£o para verificar comandos
check_command() {
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}‚úÖ $1${NC}"
  else
    echo -e "${RED}‚ùå $1 falhou${NC}"
    exit 1
  fi
}

echo -e "${YELLOW}1. Atualizando backend...${NC}"
cd backend
npm install
check_command "Depend√™ncias do backend"

echo -e "${YELLOW}2. Verificando configura√ß√£o...${NC}"
if [ ! -f .env ]; then
  echo -e "Ì≥ù Criando .env de exemplo..."
  cat > .env << 'ENVEOF'
PORT=3001
NODE_ENV=production
# GEMINI_API_KEY=sua_chave_aqui  # Opcional para IA real
CORS_ORIGIN=https://marcelogomes-dev.github.io
ENVEOF
  echo -e "${YELLOW}‚ö†Ô∏è  Edite backend/.env para adicionar chave Gemini${NC}"
fi

echo -e "${YELLOW}3. Testando backend localmente...${NC}"
npm run dev &
BACKEND_PID=$!
sleep 3

echo -e "${YELLOW}4. Testando endpoints...${NC}"
curl -s http://localhost:3001/api/health | grep -q "online"
check_command "Backend respondendo"

echo -e "${YELLOW}5. Testando IA/Fallback...${NC}"
TEST_RESPONSE=$(curl -s -X POST http://localhost:3001/api/orcamento \
  -H "Content-Type: application/json" \
  -d '{"mensagem":"teste de sistema", "persona":"Dra. Camila"}')
  
if echo "$TEST_RESPONSE" | grep -q "sucesso.*true"; then
  echo -e "${GREEN}‚úÖ Sistema IA/Fallback funcionando${NC}"
else
  echo -e "${RED}‚ùå Erro no teste${NC}"
  echo "$TEST_RESPONSE"
fi

echo -e "${YELLOW}6. Parando backend local...${NC}"
kill $BACKEND_PID 2>/dev/null

echo -e "${YELLOW}7. Atualizando frontend...${NC}"
cd ..
npm install
check_command "Depend√™ncias do frontend"

echo -e "${YELLOW}8. Build de produ√ß√£o...${NC}"
npm run build
check_command "Build do frontend"

echo -e "${YELLOW}9. Deploy no GitHub Pages...${NC}"
npm run deploy
check_command "Deploy no GitHub Pages"

echo -e "\n${GREEN}Ìæâ DEPLOY COMPLETADO!${NC}"
echo -e "Ìºê Frontend: https://marcelogomes-dev.github.io/www.oticacdo.com"
echo -e "Ì∂•Ô∏è  Backend: Hospede em https://render.com"
echo -e "Ì≥ä Health Check: Adicione /api/health ao URL do backend"
echo -e "\n${YELLOW}‚ö†Ô∏è  LEMBRETE:${NC}"
echo "1. Hospede o backend no Render.com"
echo "2. Atualize BACKEND_URL no geminiService.ts"
echo "3. Configure GEMINI_API_KEY no Render (opcional)"
