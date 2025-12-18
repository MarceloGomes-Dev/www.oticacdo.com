import { Persona } from './types';

const BACKEND_URL = 'https://seu-novo-backend.onrender.com'; // Ou seu Render

// Sistema de histórico de conversa
let conversaHistorico: Array<{role: string, content: string}> = [];

export const sendMessageToGemini = async (message: string, persona: Persona): Promise<string> => {
  console.log(`��� [${persona.name}] Enviando: "${message.substring(0, 60)}..."`);
  
  // Adicionar mensagem do usuário ao histórico
  conversaHistorico.push({ role: 'user', content: message });
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/conversa`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ 
        mensagem: message,
        persona: persona.name,
        contexto: persona.systemPrompt,
        historico: conversaHistorico.slice(-5) // Últimas 5 mensagens
      })
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    
    // Adicionar resposta da IA ao histórico
    if (data.sucesso && data.resposta) {
      conversaHistorico.push({ role: 'assistant', content: data.resposta });
      
      // Manter histórico limitado (últimas 10 trocas)
      if (conversaHistorico.length > 20) {
        conversaHistorico = conversaHistorico.slice(-20);
      }
    }
    
    return data.resposta || 'Não foi possível gerar uma resposta.';
    
  } catch (error: any) {
    console.error(`��� [${persona.name}] Erro:`, error.message);
    
    // Resposta de fallback com contexto
    return `�� **${persona.name} - ${persona.role}**
    
Com base na nossa conversa sobre "${conversaHistorico.slice(-2).map(h => h.content.substring(0, 30)).join('...')}", recomendo:

��� **Para uma análise personalizada:**
Agende uma consulta gratuita!
WhatsApp: (11) 99999-9999

⏰ **Horário de atendimento:**
Segunda a Sexta: 9h às 18h
Sábado: 9h às 13h

*Estou aqui para ajudar com todas suas dúvidas óticas!*`;
  }
};

// Nova função para conversa contínua
export const getChatSession = () => ({ historico: conversaHistorico });

export const resetChat = () => {
  conversaHistorico = [];
  console.log('��� Histórico reiniciado');
};

// Verificar status do sistema
export const checkIAStatus = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/saude`);
    const data = await response.json();
    
    return {
      status: data.status,
      iaAtiva: data.apis_ativas?.deepseek || data.apis_ativas?.huggingface,
      mensagem: data.apis_ativas?.deepseek ? '✅ IA Profissional Ativa' : '⚠️ Modo Fallback (Configure API)'
    };
  } catch {
    return { status: 'offline', iaAtiva: false, mensagem: 'Backend não respondendo' };
  }
};
