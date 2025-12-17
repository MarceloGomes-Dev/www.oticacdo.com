// services/geminiService.ts - VERSÃO CORRIGIDA (conecta ao backend)
import { Persona } from '../types';

// URL do seu backend - AJUSTE CONFORME SEU AMBIENTE:
// Para desenvolvimento local (testes):
// const BACKEND_URL = 'http://localhost:3001';
// Para produção (GitHub Pages) - SUBSTITUA pela URL real do seu backend hospedado:
const BACKEND_URL = 'http://localhost:3001'; // ← SUBSTITUA PELA SUA URL

export const sendMessageToGemini = async (message: string, persona: Persona): Promise<string> => {
  try {
    console.log(`��� Enviando mensagem para backend (${BACKEND_URL}):`, message.substring(0, 50));
    
    const response = await fetch(`${BACKEND_URL}/api/orcamento`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ 
        mensagem: message,
        contexto: `Consultor: ${persona.name}. ${persona.systemPrompt}`,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erro HTTP ${response.status}:`, errorText);
      throw new Error(`Erro HTTP ${response.status}: ${errorText.substring(0, 100)}`);
    }

    const data = await response.json();
    console.log('✅ Resposta do backend:', data.sucesso ? 'Sucesso' : 'Erro');
    
    if (data.sucesso) {
      return data.resposta;
    } else {
      return `⚠️ ${data.error || 'Erro desconhecido do servidor'}`;
    }
  } catch (error: any) {
    console.error('��� Erro ao chamar backend:', error);
    
    // Mensagens amigáveis baseadas no tipo de erro
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      return '��� Não foi possível conectar ao servidor. Verifique:\n1. Se o backend está rodando\n2. Sua conexão com internet\n3. A URL do backend está correta';
    }
    
    if (error.message.includes('CORS')) {
      return '���️ Erro de CORS. O backend não está permitindo requisições deste domínio.';
    }
    
    if (error.message.includes('401') || error.message.includes('403')) {
      return '��� Erro de autenticação. A chave da API pode estar incorreta ou expirada.';
    }
    
    return '��� Desculpe, ocorreu um erro técnico. Tente novamente em alguns instantes.';
  }
};

// Funções auxiliares (mantidas para compatibilidade com código existente)
export const getChatSession = (persona: Persona) => {
  console.log(`Criando sessão para: ${persona.name}`);
  return { 
    persona,
    backendUrl: BACKEND_URL
  };
};

export const resetChat = () => {
  console.log('��� Chat resetado - Pronto para nova conversa');
};

// Função para testar a conexão com o backend
export const testBackendConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    
    if (response.ok) {
      const data = await response.json();
      return { 
        success: true, 
        message: `✅ Backend conectado: ${data.service} (${data.status})` 
      };
    } else {
      return { 
        success: false, 
        message: `❌ Backend respondeu com erro: ${response.status}` 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      message: `❌ Não foi possível conectar ao backend em ${BACKEND_URL}. Verifique se está rodando.` 
    };
  }
};

// Função para obter a URL atual do backend (útil para debug)
export const getCurrentBackendUrl = (): string => {
  return BACKEND_URL;
};
