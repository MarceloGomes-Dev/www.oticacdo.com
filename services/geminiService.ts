import { Persona, Frame, LensOption, ChatMessage } from './types';

// URL do backend
const BACKEND_URL = 'http://localhost:3001'; // Desenvolvimento
// const BACKEND_URL = 'https://backend-otica-cdo.onrender.com'; // Produção

// Sistema de memória de conversa por usuário/sessão
interface ConversationState {
  userId: string;
  messages: ChatMessage[];
  collectedData: {
    prescriptionType?: 'Miopia' | 'Hipermetropia' | 'Astigmatismo' | 'Presbiopia' | 'Não sei';
    prescriptionValue?: number;
    frameStyle?: string;
    lensType?: string;
    budgetRange?: 'Econômico' | 'Médio' | 'Premium';
    urgency?: number; // 1-10
    preferences?: string[];
  };
  currentStep: 'initial' | 'collecting_info' | 'suggesting' | 'finalizing';
}

const conversationStates = new Map<string, ConversationState>();

// Gerar ID único para sessão
const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Buscar dados do catálogo (simulação - você pode conectar com sua base real)
const getCatalogData = () => {
  const frames: Frame[] = [
    {
      id: 'frame_001',
      name: 'Vintage Acetato',
      price: 289.90,
      imageUrl: '/frames/vintage.jpg',
      description: 'Armação vintage em acetato, leve e durável',
      gender: 'Unissex',
      usage: 'Receituário',
      shape: 'Gatinho',
      faceShape: 'Oval',
      material: 'Acetato',
      frameColor: 'Tartaruga',
      lensWidth: 52,
      bridgeSize: 18,
      templeLength: 145,
      highPrescriptionCompatible: true,
      weight: '25g'
    },
    // Adicione mais frames conforme seu catálogo
  ];

  const lenses: LensOption[] = [
    {
      id: 'lens_001',
      type: 'Single Vision',
      material: 'Resina Index 1.56',
      price: 149.90,
      features: ['Anti-risco', 'Proteção UV']
    },
    // Adicione mais lentes
  ];

  return { frames, lenses };
};

// Prompt inteligente baseado na Persona e no estado da conversa
const buildIntelligentPrompt = (
  userMessage: string,
  persona: Persona,
  conversationState: ConversationState
): string => {
  const { frames, lenses } = getCatalogData();
  const { collectedData, messages } = conversationState;

  const lastMessages = messages.slice(-3).map(m => `${m.role}: ${m.text}`).join('\n');
  const collectedInfo = Object.entries(collectedData)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');

  return `Você é ${persona.name}, ${persona.role} na Ótica CDO.
Personalidade: ${persona.systemPrompt}

CONTEXTO DA CONVERSA:
Histórico recente:
${lastMessages}

Informações já coletadas do cliente: ${collectedInfo || 'Nenhuma ainda'}

CATÁLOGO DISPONÍVEL:
ARMAÇÕES (${frames.length} disponíveis):
${frames.slice(0, 3).map(f => `• ${f.name} - R$ ${f.price} (${f.material}, ${f.frameColor}, para ${f.gender})`).join('\n')}

LENTES (${lenses.length} tipos):
${lenses.slice(0, 3).map(l => `• ${l.type} - R$ ${l.price} (${l.material}, ${l.features.join(', ')})`).join('\n')}

INSTRUÇÕES INTELIGENTES:
1. ANALISE a mensagem do cliente: "${userMessage}"
2. DETERMINE o que o cliente precisa (mesmo que ele não saiba explicar)
3. FAÇA PERGUNTAS RELEVANTES se faltar informação (ex: grau, formato de rosto, orçamento)
4. SUGIRA produtos ESPECÍFICOS do catálogo acima (nome e preço exatos)
5. CALCULE valores totais (armação + lente + tratamentos)
6. Considere PRAZOS (7-14 dias) e GARANTIA (1 ano)
7. Ofereça OPÇÕES em diferentes faixas de preço
8. Seja EMPÁTICO e PROFISSIONAL como ${persona.name}

ESTRATÉGIA DE CONVERSA:
- Fase atual: ${conversationState.currentStep}
- Se for início: Apresente-se e comece a coletar informações
- Se coletando info: Faça uma pergunta de cada vez
- Se sugerindo: Mostre 2-3 opções concretas
- Se finalizando: Resuma e peça confirmação

RESPONDA em português natural, como um consultor real.
NÃO liste todos os produtos de uma vez.
NÃO use marcadores genéricos.
SEJA conversacional e útil.`;
};

// Lógica para determinar próximo passo
const determineNextStep = (
  userMessage: string,
  currentState: ConversationState
): ConversationState => {
  const newState = { ...currentState };
  const message = userMessage.toLowerCase();

  // Extrair informações da mensagem
  if (message.includes('miopia') || message.includes('grau') || message.includes('curto')) {
    newState.collectedData.prescriptionType = 'Miopia';
  }
  if (message.includes('hipermetropia') || message.includes('longe')) {
    newState.collectedData.prescriptionType = 'Hipermetropia';
  }
  if (message.includes('astigmatismo')) {
    newState.collectedData.prescriptionType = 'Astigmatismo';
  }
  if (message.includes('vista cansada') || message.includes('presbiopia')) {
    newState.collectedData.prescriptionType = 'Presbiopia';
  }

  // Detectar orçamento
  const budgetMatch = message.match(/(\d+)\s*(reais|r\$|rs)/i);
  if (budgetMatch) {
    const value = parseInt(budgetMatch[1]);
    if (value < 300) newState.collectedData.budgetRange = 'Econômico';
    else if (value < 600) newState.collectedData.budgetRange = 'Médio';
    else newState.collectedData.budgetRange = 'Premium';
  }

  // Determinar próxima fase
  const infoCount = Object.values(newState.collectedData).filter(v => v !== undefined).length;
  
  if (infoCount < 2) {
    newState.currentStep = 'collecting_info';
  } else if (infoCount >= 2 && infoCount < 5) {
    newState.currentStep = 'suggesting';
  } else {
    newState.currentStep = 'finalizing';
  }

  return newState;
};

// Perguntas inteligentes baseadas no que falta
const getNextQuestion = (state: ConversationState): string | null => {
  const { collectedData, currentStep } = state;

  if (currentStep === 'initial') {
    return "Olá! Sou a consultora virtual da Ótica CDO. Para te ajudar a encontrar os óculos perfeitos, me conta: você já usa óculos ou está procurando seu primeiro par?";
  }

  if (currentStep === 'collecting_info') {
    if (!collectedData.prescriptionType) {
      return "Você sabe qual é o seu tipo de correção visual? (Miopia, Hipermetropia, Astigmatismo, Presbiopia ou ainda não sabe?)";
    }
    if (!collectedData.budgetRange) {
      return "Qual faixa de investimento você tem em mente para seus novos óculos? (Podemos opções econômicas, médias ou premium)";
    }
    if (!collectedData.frameStyle) {
      return "Tem preferência por algum estilo de armação? (Vintage, Moderna, Esportiva, Minimalista, etc.)";
    }
  }

  return null;
};

// Serviço principal
export const sendMessageToGemini = async (
  message: string, 
  persona: Persona, 
  sessionId?: string
): Promise<{ response: string; sessionId: string }> => {
  
  // Gerenciar sessão
  const currentSessionId = sessionId || generateSessionId();
  let conversationState = conversationStates.get(currentSessionId) || {
    userId: currentSessionId,
    messages: [],
    collectedData: {},
    currentStep: 'initial'
  };

  // Atualizar histórico
  conversationState.messages.push({
    id: `msg_${Date.now()}`,
    role: 'user',
    text: message
  });

  // Determinar próximo passo
  conversationState = determineNextStep(message, conversationState);
  
  // Verificar se devemos fazer uma pergunta ao invés de chamar a IA
  const nextQuestion = getNextQuestion(conversationState);
  if (nextQuestion && conversationState.currentStep === 'collecting_info') {
    conversationState.messages.push({
      id: `msg_${Date.now()}_1`,
      role: 'model',
      text: nextQuestion
    });
    conversationStates.set(currentSessionId, conversationState);
    
    return {
      response: nextQuestion,
      sessionId: currentSessionId
    };
  }

  // Chamar backend inteligente
  try {
    console.log(`��� [${persona.name}] Enviando para IA inteligente...`);

    const response = await fetch(`${BACKEND_URL}/api/orcamento-inteligente`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        mensagem: message,
        contexto: buildIntelligentPrompt(message, persona, conversationState),
        sessionId: currentSessionId,
        estadoConversa: conversationState
      })
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status} no backend`);
    }

    const data = await response.json();
    
    // Atualizar estado com a resposta
    conversationState.messages.push({
      id: `msg_${Date.now()}_2`,
      role: 'model',
      text: data.resposta
    });
    
    // Se a IA coletou novas informações, atualizar estado
    if (data.novasInformacoes) {
      conversationState.collectedData = {
        ...conversationState.collectedData,
        ...data.novasInformacoes
      };
    }
    
    conversationStates.set(currentSessionId, conversationState);

    return {
      response: data.resposta,
      sessionId: currentSessionId
    };

  } catch (error: any) {
    console.error('��� Erro no serviço inteligente:', error);
    
    // Fallback conversacional
    const fallbackResponse = `Olá! Sou ${persona.name}, ${persona.role.toLowerCase()} da Ótica CDO.

Parece que nosso sistema de IA está momentaneamente indisponível, mas posso te ajudar diretamente!

Para um orçamento personalizado, preciso saber:
1. Qual tipo de correção você precisa? (Miopia, Hipermetropia, Astigmatismo, Presbiopia)
2. Tem preferência por algum estilo de armação?
3. Qual sua faixa de orçamento?

Enquanto isso, posso adiantar que nossos óculos variam de R$ 189,90 a R$ 899,90, com garantia de 1 ano e entrega em 7-14 dias úteis.`;

    conversationState.messages.push({
      id: `msg_${Date.now()}_3`,
      role: 'model',
      text: fallbackResponse,
      isError: true
    });

    return {
      response: fallbackResponse,
      sessionId: currentSessionId
    };
  }
};

// Nova função para reiniciar conversa
export const resetConversation = (sessionId: string) => {
  conversationStates.delete(sessionId);
  console.log(`��� Conversa ${sessionId} reiniciada`);
};

// Obter histórico da conversa
export const getConversationHistory = (sessionId: string): ChatMessage[] => {
  return conversationStates.get(sessionId)?.messages || [];
};

// Verificar progresso da conversa
export const getConversationProgress = (sessionId: string) => {
  const state = conversationStates.get(sessionId);
  if (!state) return null;

  const totalFields = 6; // Número total de campos que podemos coletar
  const filledFields = Object.values(state.collectedData).filter(v => v !== undefined).length;
  
  return {
    progress: Math.round((filledFields / totalFields) * 100),
    currentStep: state.currentStep,
    collectedData: state.collectedData
  };
};

// Funções de compatibilidade (para código existente)
export const getChatSession = (persona: Persona) => ({
  persona,
  sessionId: generateSessionId()
});

export const resetChat = () => {
  console.log('��� Todas as conversas reiniciadas');
  conversationStates.clear();
};
