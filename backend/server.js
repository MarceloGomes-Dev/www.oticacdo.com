import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { FRAMES, LENSES, TREATMENTS, PERSONAS, PAYMENT_METHODS, DELIVERY_TIMES } from './data.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// Cache simples em memória (evita repetir consultas similares)
const responseCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Inicializa Gemini (se chave existir)
let ai = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY 
    });
    console.log('��� Gemini API inicializada');
  } catch (error) {
    console.warn('⚠️  Gemini API não pôde ser inicializada:', error.message);
  }
}

// Middleware
app.use(cors({
  origin: [
    'https://marcelogomes-dev.github.io',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());

// ========== SISTEMA DE FALLBACK RICO ==========

const generateRichFallback = (message, persona, useCase) => {
  console.log(`�� Gerando fallback rico para: "${message.substring(0, 50)}..."`);
  
  const personaData = PERSONAS.find(p => p.name === persona) || PERSONAS[0];
  
  // Análise da mensagem do cliente
  const isBudgetQuestion = message.toLowerCase().includes('quanto') || 
                          message.toLowerCase().includes('preço') ||
                          message.toLowerCase().includes('custo');
  
  const isStyleQuestion = message.toLowerCase().includes('estilo') ||
                         message.toLowerCase().includes('moda') ||
                         message.toLowerCase().includes('formato');
  
  const isTechnicalQuestion = message.toLowerCase().includes('lente') ||
                             message.toLowerCase().includes('grau') ||
                             message.toLowerCase().includes('tratamento');
  
  // Seleciona frames baseado na consulta
  let recommendedFrames = FRAMES;
  if (isStyleQuestion) {
    recommendedFrames = FRAMES.filter(f => f.shape === 'Gatinho' || f.shape === 'Aviador');
  } else if (isTechnicalQuestion) {
    recommendedFrames = FRAMES.filter(f => f.usage === 'Receituário');
  }
  
  // Seleciona lentes baseado na consulta
  let recommendedLenses = LENSES;
  if (message.toLowerCase().includes('multifocal') || message.toLowerCase().includes('progressiva')) {
    recommendedLenses = LENSES.filter(l => l.type.includes('Multifocal'));
  } else if (message.toLowerCase().includes('fotossensível') || message.toLowerCase().includes('escurece')) {
    recommendedLenses = LENSES.filter(l => l.type.includes('Fotossensível'));
  }
  
  // Gera orçamento detalhado
  const sampleFrame = recommendedFrames[Math.floor(Math.random() * recommendedFrames.length)];
  const sampleLens = recommendedLenses[Math.floor(Math.random() * recommendedLenses.length)];
  const sampleTreatment = TREATMENTS[Math.floor(Math.random() * TREATMENTS.length)];
  
  const totalPrice = sampleFrame.price + sampleLens.price + sampleTreatment.price;
  
  // Resposta personalizada baseada na persona
  let response = '';
  
  if (personaData.role.includes('Optometrista')) {
    response = `��� **${personaData.name} - ${personaData.role}**
    
Baseado na sua solicitação: "${message}"

��� **ANÁLISE TÉCNICA:**
• Tipo de lente recomendada: ${sampleLens.type} (${sampleLens.material})
• Tratamento essencial: ${sampleTreatment.name} - ${sampleTreatment.description}
• Compatibilidade com graus altos: ${sampleFrame.description.includes('graus altos') ? 'Sim ✅' : 'Verificar'}

��� **ORÇAMENTO DETALHADO:**
1. Armação ${sampleFrame.name}: R$ ${sampleFrame.price.toFixed(2)}
2. Lente ${sampleLens.type}: R$ ${sampleLens.price.toFixed(2)}
3. Tratamento ${sampleTreatment.name}: R$ ${sampleTreatment.price.toFixed(2)}
   ─────────────────────────────
   **TOTAL: R$ ${totalPrice.toFixed(2)}**

⏰ **PRAZO:** ${DELIVERY_TIMES[1].time}
�� **CONDIÇÕES:** ${PAYMENT_METHODS[0].method} com ${PAYMENT_METHODS[0].discount} off

��� **RECOMENDAÇÃO TÉCNICA:**
${sampleLens.description}. ${sampleTreatment.description}

��� **Próximo passo:** Agende uma consulta para medições precisas.`;
  
  } else if (personaData.role.includes('Visagismo')) {
    response = `��� **${personaData.name} - ${personaData.role}**
    
Analisando sua busca: "${message}"

✨ **ANÁLISE DE ESTILO:**
• Formato sugerido: ${sampleFrame.shape}
• Cor que realça: ${sampleFrame.frameColor}
• Material ideal: ${sampleFrame.material}

��� **SUGESTÕES DE ARMAÇÃO:**
1. **${sampleFrame.name}** - ${sampleFrame.description}
   → Cor: ${sampleFrame.frameColor} | Peso: ${sampleFrame.weight}
   → Preço: R$ ${sampleFrame.price.toFixed(2)}

2. **${FRAMES[1].name}** - ${FRAMES[1].description}
   → Cor: ${FRAMES[1].frameColor} | Estilo: ${FRAMES[1].shape}
   → Preço: R$ ${FRAMES[1].price.toFixed(2)}

��� **DICAS DE VISAGISMO:**
• Armação ${sampleFrame.shape} harmoniza com vários formatos de rosto
• Cor ${sampleFrame.frameColor} é versátil para uso diário
• ${sampleFrame.material} oferece durabilidade e conforto

��� **INVESTIMENTO:**
Armação + lente básica: a partir de R$ ${(sampleFrame.price + LENSES[0].price).toFixed(2)}

��� **Agende uma consulta de visagismo para análise personalizada!**`;
  
  } else {
    // Consultora Comercial
    response = `��� **${personaData.name} - ${personaData.role}**
    
Entendi sua necessidade: "${message}"

��� **MELHOR CUSTO-BENEFÍCIO:**

���️ **OPÇÃO ECONÔMICA:**
• Armação: ${FRAMES[0].name} - R$ ${FRAMES[0].price.toFixed(2)}
• Lente: ${LENSES[0].type} - R$ ${LENSES[0].price.toFixed(2)}
• **Total: R$ ${(FRAMES[0].price + LENSES[0].price).toFixed(2)}**

⭐ **OPÇÃO PREMIUM:**
• Armação: ${sampleFrame.name} - R$ ${sampleFrame.price.toFixed(2)}
• Lente: ${sampleLens.type} - R$ ${sampleLens.price.toFixed(2)}
• Tratamento: ${sampleTreatment.name} - R$ ${sampleTreatment.price.toFixed(2)}
• **Total: R$ ${totalPrice.toFixed(2)}**

��� **PROMOÇÕES ATIVAIS:**
• Combo completo: 15% de desconto
• 2ª unidade: 30% off (óculos de sol)
• PIX: 10% adicional

⏰ **PRAZOS:**
${DELIVERY_TIMES.map(d => `• ${d.type}: ${d.time}`).join('\n')}

��� **FORMA DE PAGAMENTO:**
${PAYMENT_METHODS.map(p => `• ${p.method}${p.discount ? ` (${p.discount})` : ''}${p.installments ? ` ${p.installments}` : ''}`).join('\n')}

��� **Fale comigo para negociar condições especiais!**`;
  }
  
  return response;
};

// ========== SISTEMA DE CACHE ==========

const getCacheKey = (message, persona) => {
  const normalizedMessage = message.toLowerCase().trim();
  const key = `${persona}:${normalizedMessage.substring(0, 100)}`;
  return key;
};

const checkCache = (key) => {
  const cached = responseCache.get(key);
  if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
    console.log('��� Resposta recuperada do cache');
    return cached.response;
  }
  return null;
};

const saveToCache = (key, response) => {
  responseCache.set(key, {
    response,
    timestamp: Date.now()
  });
  // Limitar tamanho do cache
  if (responseCache.size > 100) {
    const firstKey = responseCache.keys().next().value;
    responseCache.delete(firstKey);
  }
};

// ========== ROTAS PRINCIPAIS ==========

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'online',
    service: 'Ótica CDO - IA Avançada',
    timestamp: new Date().toISOString(),
    features: {
      gemini: !!ai,
      cache: responseCache.size,
      fallback: 'rich',
      personas: PERSONAS.length,
      products: FRAMES.length + LENSES.length
    },
    stats: {
      cacheSize: responseCache.size,
      cacheHits: Object.fromEntries(
        Array.from(responseCache.entries()).slice(0, 3)
      )
    }
  });
});

app.post('/api/orcamento', async (req, res) => {
  const startTime = Date.now();
  const { mensagem, contexto, persona = 'Dra. Camila' } = req.body;
  
  if (!mensagem) {
    return res.status(400).json({ 
      sucesso: false,
      error: 'Mensagem é obrigatória' 
    });
  }
  
  console.log(`��� [${persona}] Consulta: "${mensagem.substring(0, 80)}..."`);
  
  // Verificar cache
  const cacheKey = getCacheKey(mensagem, persona);
  const cachedResponse = checkCache(cacheKey);
  
  if (cachedResponse) {
    return res.json({
      sucesso: true,
      resposta: cachedResponse,
      metadata: {
        fonte: 'cache',
        tempo: `${Date.now() - startTime}ms`,
        persona,
        cacheHit: true
      }
    });
  }
  
  // Tentar Gemini se disponível
  if (ai) {
    try {
      console.log('��� Tentando Gemini API...');
      
      const prompt = `Você é ${persona}, ${PERSONAS.find(p => p.name === persona)?.role || 'consultora'} da Ótica CDO.

CONTEXTO: ${contexto || 'Cliente solicitando orçamento'}

PERGUNTA DO CLIENTE: "${mensagem}"

BASE DE DADOS DA ÓTICA CDO:
- Armações disponíveis: ${FRAMES.map(f => `${f.name} (R$ ${f.price})`).join(', ')}
- Lentes: ${LENSES.map(l => `${l.type} por R$ ${l.price}`).join(', ')}
- Tratamentos: ${TREATMENTS.map(t => `${t.name} +R$ ${t.price}`).join(', ')}
- Formas de pagamento: ${PAYMENT_METHODS.map(p => p.method).join(', ')}
- Prazos: ${DELIVERY_TIMES.map(d => `${d.type}: ${d.time}`).join(', ')}

INSTRUÇÕES:
1. Responda como ${persona} - use tom profissional mas acolhedor
2. Forneça orçamento REALISTA baseado nos preços acima
3. Inclua pelo menos 2 opções (econômica e premium)
4. Seja específico com valores, prazos e condições
5. Encerre com um call-to-action apropriado

RESPONDA EM PORTUGUÊS BRASILEIRO:`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [{ 
          role: 'user', 
          parts: [{ text: prompt }] 
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1500,
        }
      });
      
      const respostaGemini = response.text;
      console.log('✅ Gemini respondeu com sucesso');
      
      // Salvar no cache
      saveToCache(cacheKey, respostaGemini);
      
      return res.json({
        sucesso: true,
        resposta: respostaGemini,
        metadata: {
          fonte: 'gemini_ai',
          tempo: `${Date.now() - startTime}ms`,
          modelo: 'gemini-1.5-flash',
          persona,
          cacheSaved: true
        }
      });
      
    } catch (error) {
      console.warn('❌ Gemini falhou:', error.message);
      
      // Se erro for 429 (quota) ou 403 (access), usar fallback rico
      if (error.message.includes('429') || error.message.includes('quota') || 
          error.message.includes('403') || error.message.includes('billing')) {
        console.log('��� Usando fallback rico (quota excedida)');
      } else {
        console.log('⚠️  Erro na Gemini, usando fallback rico');
      }
    }
  }
  
  // Usar fallback rico
  const fallbackResponse = generateRichFallback(mensagem, persona, 'default');
  
  // Salvar fallback no cache também
  saveToCache(cacheKey, fallbackResponse);
  
  res.json({
    sucesso: true,
    resposta: fallbackResponse,
    metadata: {
      fonte: 'fallback_rico',
      tempo: `${Date.now() - startTime}ms`,
      persona,
      cacheSaved: true,
      observacao: ai ? 'Gemini indisponível' : 'Modo apenas fallback'
    }
  });
});

// ========== ROTAS ADICIONAIS ==========

app.get('/api/produtos', (req, res) => {
  res.json({
    armações: FRAMES,
    lentes: LENSES,
    tratamentos: TREATMENTS,
    totalProdutos: FRAMES.length + LENSES.length + TREATMENTS.length
  });
});

app.get('/api/personas', (req, res) => {
  res.json(PERSONAS);
});

app.get('/api/cache/status', (req, res) => {
  res.json({
    size: responseCache.size,
    keys: Array.from(responseCache.keys()).slice(0, 10),
    maxSize: 100,
    duration: '5 minutos'
  });
});

app.post('/api/cache/clear', (req, res) => {
  const previousSize = responseCache.size;
  responseCache.clear();
  res.json({
    sucesso: true,
    mensagem: `Cache limpo (${previousSize} entradas removidas)`
  });
});

app.post('/api/teste-completo', async (req, res) => {
  try {
    const testCases = [
      { mensagem: 'Preciso de um óculos para miopia, com lente fina', persona: 'Dra. Camila' },
      { mensagem: 'Quero um óculos de sol estiloso', persona: 'Eduardo' },
      { mensagem: 'Qual o melhor custo-benefício para óculos de grau?', persona: 'Mariana' }
    ];
    
    const results = [];
    
    for (const testCase of testCases) {
      const start = Date.now();
      const cacheKey = getCacheKey(testCase.mensagem, testCase.persona);
      const cached = checkCache(cacheKey);
      
      results.push({
        caso: testCase.mensagem.substring(0, 40) + '...',
        persona: testCase.persona,
        cache: cached ? 'HIT' : 'MISS',
        gemini: ai ? 'DISPONÍVEL' : 'INDISPONÍVEL'
      });
    }
    
    res.json({
      status: 'sistema_operacional',
      testes: results,
      cacheSize: responseCache.size,
      gemini: !!ai,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== INICIALIZAÇÃO ==========

app.listen(PORT, () => {
  console.log(`
  �� ÓTICA CDO - IA AVANÇADA
  ==========================
  ��� Porta: ${PORT}
  ��� Gemini: ${ai ? '✅ CONECTADA' : '⚠️  SEM CHAVE'}
  ��� Cache: Pronto (0 entradas)
  ��� Personas: ${PERSONAS.length} configuradas
  ��� Produtos: ${FRAMES.length} armações, ${LENSES.length} lentes
  
  ��� Endpoints:
  • Health: http://localhost:${PORT}/api/health
  • Produtos: http://localhost:${PORT}/api/produtos
  • Personas: http://localhost:${PORT}/api/personas
  • Cache: http://localhost:${PORT}/api/cache/status
  
  ⚡ Sistema: ${ai ? 'Gemini + Fallback' : 'Apenas Fallback'}
  `);
  
  // Pré-cache de perguntas frequentes
  const frequentQuestions = [
    { q: 'Quanto custa um óculos completo?', p: 'Mariana' },
    { q: 'Preciso de lente para astigmatismo', p: 'Dra. Camila' },
    { q: 'Qual armação combina com meu rosto?', p: 'Eduardo' }
  ];
  
  frequentQuestions.forEach(({ q, p }) => {
    const key = getCacheKey(q, p);
    const response = generateRichFallback(q, p, 'precache');
    saveToCache(key, response);
  });
  
  console.log(`✅ ${frequentQuestions.length} perguntas frequentes pré-cacheadas`);
});
