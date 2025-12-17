// services/geminiService.ts - VERSÃO SIMPLIFICADA E ROBUSTA
import { Persona } from '../types';

// URL do seu backend - AJUSTE CONFORME SEU AMBIENTE:
// Para desenvolvimento local (testes):
// const BACKEND_URL = 'https://backend-otica-cdo.onrender.com';
// Para produção (GitHub Pages) - SUBSTITUA pela URL real do seu backend hospedado:
const BACKEND_URL = 'https://backend-otica-cdo.onrender.com'; // ← SUBSTITUA PELA SUA URL REAL

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
      }),
      // Timeout opcional para não deixar a requisição pendente para sempre
      signal: AbortSignal.timeout(15000) // 15 segundos
    });

    if (!response.ok) {
      // Tenta obter detalhes do erro do backend
      let errorDetail = `Erro HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorDetail += `: ${errorData.error || JSON.stringify(errorData)}`;
      } catch {
        // Se não conseguir parsear como JSON, usa o texto
        const errorText = await response.text();
        errorDetail += `: ${errorText.substring(0, 100)}`;
      }
      
      console.error(`❌ ${errorDetail}`);
      throw new Error(errorDetail);
    }

    const data = await response.json();
    console.log('✅ Resposta do backend:', data.sucesso ? 'Sucesso' : 'Erro');
    
    // O backend agora SEMPRE retorna 'sucesso: true' (com fallback se precisar)
    // Mas mantemos a verificação por segurança
    if (data.sucesso) {
      return data.resposta;
    } else {
      // Se por algum motivo 'sucesso' for false, ainda temos a resposta do fallback
      return data.resposta || `⚠️ ${data.error || 'Erro no processamento'}`;
    }
  } catch (error: any) {
    console.error('��� Erro ao chamar backend:', error);
    
    // Mensagens amigáveis baseadas no tipo de erro
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      return '⏰ A solicitação está demorando muito. O servidor pode estar sobrecarregado. Tente novamente.';
    }
    
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      return '��� Não foi possível conectar ao servidor. Verifique:\n1. Se o backend está rodando\n2. Sua conexão com internet\n3. A URL do backend está correta';
    }
    
    if (error.message.includes('CORS')) {
      return '���️ Erro de CORS. O backend não está permitindo requisições deste domínio.';
    }
    
    if (error.message.includes('401') || error.message.includes('403')) {
      return '��� Erro de autenticação.';
    }
    
    if (error.message.includes('429')) {
      return '��� O serviço está temporariamente limitado. O sistema usará respostas pré-definidas.';
    }
    
    // Fallback local SIMPLES para emergências (caso o backend também esteja offline)
    return `��� ORÇAMENTO ÓTICA CDO

Olá! No momento nosso sistema automático está processando sua solicitação.

��� Para um atendimento imediato:
• WhatsApp: (11) 98765-4321
• Telefone: (11) 3333-3333

⏰ Horário: Segunda a Sexta, 9h às 18h

��� Av. Paulista, 1000 - São Paulo

*Tente novamente em alguns instantes ou entre em contato diretamente.*`;
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
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(5000) // 5 segundos para health check
    });
    
    if (response.ok) {
      const data = await response.json();
      return { 
        success: true, 
        message: `✅ Backend conectado: ${data.service} (${data.status}) - Modo: ${data.modoOperacao || 'ativo'}` 
      };
    } else {
      return { 
        success: false, 
        message: `❌ Backend respondeu com erro: ${response.status}` 
      };
    }
  } catch (error: any) {
    return { 
      success: false, 
      message: `❌ Não foi possível conectar ao backend em ${BACKEND_URL}. ${error.message}` 
    };
  }
};

// Função para obter a URL atual do backend (útil para debug)
export const getCurrentBackendUrl = (): string => {
  return BACKEND_URL;
};
