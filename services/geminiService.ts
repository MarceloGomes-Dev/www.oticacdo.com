import { Persona } from './types';

// ‚ö†Ô∏è SUBSTITUA PELA URL DO SEU RENDER
const BACKEND_URL = 'https://otica-cdo-ia-marcelo.onrender.com'; // OU sua URL

// Sistema de hist√≥rico
let conversaHistorico: Array<{role: string, content: string}> = [];

export const sendMessageToGemini = async (message: string, persona: Persona): Promise<string> => {
  console.log(`Ì≤¨ [${persona.name}] Enviando para: ${BACKEND_URL}`);
  
  conversaHistorico.push({ role: 'user', content: message });
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/conversa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        mensagem: message,
        persona: persona.name,
        contexto: persona.systemPrompt,
        historico: conversaHistorico.slice(-5)
      })
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    
    if (data.sucesso && data.resposta) {
      conversaHistorico.push({ role: 'assistant', content: data.resposta });
      if (conversaHistorico.length > 20) {
        conversaHistorico = conversaHistorico.slice(-20);
      }
    }
    
    return data.resposta || 'N√£o foi poss√≠vel gerar uma resposta.';
    
  } catch (error: any) {
    console.error(`Ì¥• [${persona.name}] Erro:`, error.message);
    
    return `Ì≤° **${persona.name} - ${persona.role}**
    
Ì≥û **Para atendimento personalizado:**
WhatsApp: (11) 99999-9999
Telefone: (11) 3333-3333

‚è∞ **Hor√°rio:**
Seg-Sex: 9h-18h
S√°b: 9h-13h

*Retornarei em instantes!*`;
  }
};

export const getChatSession = () => ({ historico: conversaHistorico });
export const resetChat = () => {
  conversaHistorico = [];
  console.log('Ì≤¨ Hist√≥rico reiniciado');
};

export const checkIAStatus = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/saude`);
    const data = await response.json();
    return {
      status: data.status,
      iaAtiva: data.apis_ativas?.deepseek,
      mensagem: data.apis_ativas?.deepseek ? '‚úÖ IA Profissional Ativa' : '‚ö†Ô∏è Configure API Key'
    };
  } catch {
    return { status: 'offline', iaAtiva: false };
  }
};
