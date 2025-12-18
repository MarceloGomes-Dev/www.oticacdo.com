import { Persona } from './types';

// URL do backend em produ√ß√£o (substitua pela sua URL do Render)
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
      }),
      signal: AbortSignal.timeout(30000)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.resposta || 'N√£o foi poss√≠vel gerar uma resposta no momento.';
    
  } catch (error: any) {
    console.error(`Ì¥• [${persona.name}] Erro:`, error.message);
    
    // Fallback local
    return `Ì±ì **${persona.name} - ${persona.role}**
    
Desculpe, estou com dificuldades t√©cnicas no momento.

Com base na sua pergunta sobre "${message.substring(0, 50)}...", aqui est√° uma orienta√ß√£o:

Ì≤° **OP√á√ÉO IMEDIATA:**
‚Ä¢ Visite nossa loja para atendimento presencial
‚Ä¢ Ligue para (11) 3333-3333

Ì≥û **Contato direto:**
WhatsApp: (11) 99999-9999
Hor√°rio: Seg-Sex 9h-18h`;
  }
};

// Fun√ß√µes auxiliares
export const getChatSession = () => ({});
export const resetChat = () => console.log('Ì≤¨ Chat reiniciado');
export const getPersonas = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/personas`);
    return await response.json();
  } catch (error) {
    return { error: 'N√£o foi poss√≠vel carregar personas' };
  }
};
