
import { GoogleGenAI, Chat } from "@google/genai";
import { FRAMES, LENSES } from '../data';
import { Persona } from '../types';

// Initialize the Gemini API client
// Note: process.env.API_KEY is injected automatically in the runtime environment.
const apiKey = process.env.API_KEY;

if (!apiKey) {
    console.error("CRITICAL ERROR: API_KEY is missing from process.env. Please ensure you have configured your environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-to-prevent-crash-init' });

// Function to generate specific context based on the selected Persona
const generateSystemInstruction = (persona: Persona) => {
    return `
Você é ${persona.name}, uma Consultora Virtual da "Ótica CDO" (Cia dos Óculos).
Sua personalidade: ${persona.systemPrompt}
Sua função principal: Ajudar o cliente a encontrar o óculos ideal e fazer um orçamento.

DADOS DA LOJA (Use estritamente estes dados para sugerir produtos e preços):

ARMAÇÕES DISPONÍVEIS:
${JSON.stringify(FRAMES.map(f => `${f.name} - R$ ${f.price} 
   Categoria: ${f.usage} (${f.gender}), Estilo: ${f.shape}
   Material: ${f.material}, Cor: ${f.frameColor}
   Medidas: ${f.lensWidth}-${f.bridgeSize}-${f.templeLength}, Peso: ${f.weight}
   Desc: ${f.description}`), null, 2)}

LENTES DISPONÍVEIS:
${JSON.stringify(LENSES.map(l => `${l.type} - Material: ${l.material} - R$ ${l.price} - Atributos: ${l.features.join(', ')}`), null, 2)}

DIRETRIZES OBRIGATÓRIAS:
1. Mantenha-se no personagem (${persona.name}) o tempo todo, mas seja sempre educada e profissional como uma consultora.
2. Pergunte ao cliente sobre grau, estilo ou preferências se ele não informar.
3. Se o cliente perguntar detalhes técnicos, use os dados fornecidos no catálogo acima.
4. Sugira armações baseadas no formato do rosto se relevante.
5. Ao dar um orçamento, SEMPRE some o valor da armação + lente e mostre o total explicitamente.
6. Se o cliente perguntar algo fora do contexto de ótica/óculos, traga a conversa de volta para os produtos gentilmente.

IMPORTANTE: Se o cliente não escolher um modelo específico, use a média de preços ou um exemplo para o orçamento.
`;
};

let chatSession: Chat | null = null;
let currentPersonaId: string | null = null;

export const getChatSession = (persona: Persona): Chat => {
  // If session exists AND persona hasn't changed, return existing session
  if (chatSession && currentPersonaId === persona.id) {
    return chatSession;
  }

  // Otherwise, create a new session with the specific persona instruction
  currentPersonaId = persona.id;
  try {
      chatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: generateSystemInstruction(persona),
          temperature: 0.7, // Balanced for creativity and accuracy
        },
      });
      return chatSession;
  } catch (e) {
      console.error("Failed to create chat session:", e);
      throw e;
  }
};

export const sendMessageToGemini = async (message: string, persona: Persona): Promise<string> => {
  if (!process.env.API_KEY) {
      return "Erro de Configuração: API Key não encontrada. Se você está rodando isso localmente, verifique seu arquivo .env ou configuração de variáveis de ambiente.";
  }

  try {
    const chat = getChatSession(persona);
    const result = await chat.sendMessage({ message });
    return result.text || "Desculpe, não consegui gerar uma resposta textual no momento.";
  } catch (error: any) {
    console.error("Gemini API Error Detail:", error);
    
    // Check for common error codes if available in the error object
    if (error.message?.includes('401') || error.status === 401) {
        return "Erro de Autenticação: Sua chave de API parece inválida ou expirada.";
    }
    if (error.message?.includes('429') || error.status === 429) {
        return "Muitas solicitações: O sistema está sobrecarregado no momento. Tente novamente em alguns segundos.";
    }

    return "Desculpe, ocorreu um erro técnico ao processar sua solicitação. Tente reformular sua pergunta.";
  }
};

export const resetChat = () => {
  chatSession = null;
  currentPersonaId = null;
};
