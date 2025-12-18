import { Persona } from './types';

// ‚ö†Ô∏è SUBSTITUA PELA SUA NOVA URL DO RENDER
const BACKEND_URL = 'https://backend-otica-cdo-oobw.onrender.com';

export const sendMessageToGemini = async (message: string, persona: Persona): Promise<string> => {
  console.log(`Ì¥ñ Enviando para: ${BACKEND_URL}`);
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/orcamento`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        mensagem: message,
        persona: persona.name 
      })
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    return data.resposta || 'N√£o foi poss√≠vel gerar uma resposta.';
    
  } catch (error: any) {
    console.error('Erro:', error.message);
    
    return `Ì±ì **${persona.name}**
    
Ì≥û Contato direto:
WhatsApp: (11) 99999-9999
Telefone: (11) 3333-3333`;
  }
};

export const getChatSession = () => ({});
export const resetChat = () => console.log('Chat reiniciado');
