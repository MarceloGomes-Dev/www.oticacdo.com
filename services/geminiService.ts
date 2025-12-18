import { Persona } from './types';

// URL do backend em PRODU√á√ÉO (Render.com)
const BACKEND_URL = 'https://backend-otica-cdo.onrender.com';

export const sendMessageToGemini = async (message: string, persona: Persona): Promise<string> => {
  console.log(`Ì¥ñ [${persona.name}] Enviando para: ${BACKEND_URL}`);
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/orcamento`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ 
        mensagem: message,
        contexto: `Persona: ${persona.name} - ${persona.role}`,
        persona: persona.name
      })
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    return data.resposta || 'N√£o foi poss√≠vel gerar uma resposta no momento.';
    
  } catch (error: any) {
    console.error(`Ì¥• [${persona.name}] Erro:`, error.message);
    
    return `Ì±ì **${persona.name} - ${persona.role}**
    
Desculpe, estou com dificuldades t√©cnicas no momento.

Ì≥û **Contato direto:**
WhatsApp: (11) 99999-9999
Telefone: (11) 3333-3333
Hor√°rio: Seg-Sex 9h-18h`;
  }
};

// Fun√ß√µes auxiliares
export const getChatSession = () => ({});
export const resetChat = () => console.log('Ì≤¨ Chat reiniciado');

// Nova fun√ß√£o para testar todo o sistema
export const testSistemaCompleto = async (): Promise<any> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/teste-completo`);
    return await response.json();
  } catch (error) {
    return {
      status: 'offline',
      mensagem: 'Backend n√£o respondendo',
      detalhes: error.message
    };
  }
};
