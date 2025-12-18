import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: ['https://marcelogomes-dev.github.io/www.oticacdo.com/', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// ========== CONFIGURAÇÕES DAS APIS ==========
const APIS_CONFIG = {
  deepseek: {
    url: 'https://api.deepseek.com/v1/chat/completions',
    apiKey: process.env.DEEPSEEK_API_KEY,
    model: 'deepseek-chat',
    active: !!process.env.DEEPSEEK_API_KEY
  },
  huggingface: {
    url: 'https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct',
    apiKey: process.env.HUGGINGFACE_API_KEY,
    active: !!process.env.HUGGINGFACE_API_KEY
  }
};

// ========== SISTEMA DE IA HÍBRIDO ==========
const queryDeepSeek = async (prompt) => {
  if (!APIS_CONFIG.deepseek.active) return null;
  
  try {
    const response = await axios.post(
      APIS_CONFIG.deepseek.url,
      {
        model: APIS_CONFIG.deepseek.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${APIS_CONFIG.deepseek.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.warn('❌ DeepSeek falhou:', error.message);
    return null;
  }
};

const queryHuggingFace = async (prompt) => {
  if (!APIS_CONFIG.huggingface.active) return null;
  
  try {
    const response = await axios.post(
      APIS_CONFIG.huggingface.url,
      { inputs: prompt },
      {
        headers: {
          'Authorization': `Bearer ${APIS_CONFIG.huggingface.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );
    
    return response.data[0]?.generated_text || response.data;
  } catch (error) {
    console.warn('❌ Hugging Face falhou:', error.message);
    return null;
  }
};

// ========== SISTEMA DE CONVERSAÇÃO PROFISSIONAL ==========
const criarPromptProfissional = (mensagem, persona, contexto) => {
  return `Você é ${persona}, consultor da Ótica CDO - Cia dos Óculos.

CONTEXTO DA CONVERSA:
${contexto}

PERGUNTA DO CLIENTE:
"${mensagem}"

INSTRUÇÕES PARA RESPOSTA PROFISSIONAL:
1. SEJA EMPÁTICO - mostre que entende a necessidade
2. SEJA TÉCNICO - explique conceitos de forma clara
3. SEJA COMERCIAL - sugira produtos quando apropriado
4. SEJA NATURAL - fale como humano, não como robô
5. SEJA DIRETO - vá ao ponto, mas com educação
6. USE FORMATO - tópicos curtos, parágrafos claros

EXEMPLO DE RESPOSTA IDEAL:
"Entendo perfeitamente sua necessidade! Como especialista em óculos para [contexto], recomendo...

1️⃣ PRIMEIRA OPÇÃO: [Explicação técnica simples]
   • Vantagem: [benefício claro]
   • Investimento: R$ [valor]

2️⃣ SEGUNDA OPÇÃO: [Alternativa mais econômica]
   • Vantagem: [outro benefício]
   • Investimento: R$ [valor]

��� Próximo passo: [call-to-action específico]"

AGORA, RESPONDA COMO ${persona}:`;
};

// ========== ROTA PRINCIPAL ==========
app.post('/api/conversa', async (req, res) => {
  const { mensagem, persona = 'Dra. Camila', contexto = '', historico = [] } = req.body;
  
  if (!mensagem) {
    return res.status(400).json({ sucesso: false, error: 'Mensagem é obrigatória' });
  }
  
  console.log(`��� [${persona}] Cliente: "${mensagem.substring(0, 80)}..."`);
  
  // Construir contexto da conversa
  const contextoCompleto = historico.length > 0 
    ? `Histórico recente:\n${historico.slice(-3).map(h => `${h.role}: ${h.content}`).join('\n')}\n\n${contexto}`
    : contexto;
  
  const prompt = criarPromptProfissional(mensagem, persona, contextoCompleto);
  
  // TENTAR APIS NA ORDEM
  let resposta = null;
  let fonte = 'fallback';
  
  // 1. Tentar DeepSeek
  if (APIS_CONFIG.deepseek.active) {
    resposta = await queryDeepSeek(prompt);
    if (resposta) fonte = 'deepseek';
  }
  
  // 2. Tentar Hugging Face
  if (!resposta && APIS_CONFIG.huggingface.active) {
    resposta = await queryHuggingFace(prompt);
    if (resposta) fonte = 'huggingface';
  }
  
  // 3. Fallback rico
  if (!resposta) {
    resposta = criarRespostaFallback(mensagem, persona);
    fonte = 'fallback_rico';
  }
  
  // Limpar e formatar resposta
  const respostaLimpa = resposta
    .replace(/\n\s*\n\s*\n/g, '\n\n')  // Remover múltiplas quebras
    .trim();
  
  res.json({
    sucesso: true,
    resposta: respostaLimpa,
    metadata: {
      fonte,
      persona,
      tokens: respostaLimpa.length,
      timestamp: new Date().toISOString()
    }
  });
});

// ========== RESPOSTAS DE FALLBACK RICAS ==========
const criarRespostaFallback = (mensagem, persona) => {
  const respostas = {
    'Dra. Camila': `���‍⚕️ **Dra. Camila - Optometrista Técnica**
    
Entendo sua preocupação com "${mensagem.substring(0, 50)}...". 

��� **Minha análise técnica:**

Para seu caso específico, recomendo uma avaliação em três aspectos:

1. **CONFORTO VISUAL**
   • Lentes com tratamento anti-reflexo obrigatório
   • Material: Resina index 1.61 (equilíbrio perfeito)
   • Proteção UV 100% incluso

2. **SAÚDE OCULAR**
   • Intervalos de 20-20-20 (a cada 20 minutos, 20 segundos olhando a 20 pés)
   • Iluminação adequada no ambiente
   • Umidade ocular preservada

3. **INVESTIMENTO INTELIGENTE**
   • Opção básica: R$ 429,90 (lente + armação)
   • Opção premium: R$ 689,90 (com blue light e antirreflexo)

��� **Próximo passo ideal:** Agende um exame de acuidade visual gratuito em nossa loja. Traga receitas antigas se tiver.`,

    'Eduardo': `��� **Eduardo - Especialista em Visagismo**
    
Analisando seu interesse por "${mensagem.substring(0, 50)}...":

✨ **PARA SUA AUTOESTIMA:**

• **FORMATO IDEAL:** Baseado no formato do seu rosto (preciso vê-lo pessoalmente)
• **COR QUE REALÇA:** Cores quentes para pele morena, frias para pele clara
• **MATERIAL ELEGANTE:** Acetato italiano para conforto e durabilidade

��� **SUGESTÕES IMEDIATAS:**

1. **Para rosto redondo/oval:** Armação angular (quadrada/retangular)
2. **Para rosto quadrado:** Armação redonda/oval
3. **Para todos:** Cor tartaruga (clássica e atemporal)

��� **DICA EXCLUSIVA:** Óculos não são só correção visual - são acessório de moda! Nesta temporada, as armações finas em metal estão em alta.

��� **Experimente sem compromisso em nossa loja!**`,

    'Mariana': `��� **Mariana - Consultora Comercial**
    
Perfeito! Vamos analisar "${mensagem.substring(0, 50)}...":

��� **MELHOR CUSTO-BENEFÍCIO HOJE:**

��� **PROMOÇÃO RELÂMPAGO (válida por 48h):**
• Combo completo: Armação + lente 1.61 + antirreflexo
• De: R$ 789,90 → Por: R$ 589,90
• Forma de pagamento: 10x R$ 58,99

��� **COMPARATIVO DIRETO:**
1. **Econômico:** R$ 329,90 (básico, funcional)
2. **Intermediário:** R$ 489,90 (recomendado, melhor custo)
3. **Premium:** R$ 789,90 (top de linha, todos tratamentos)

⏰ **PRAZOS REALISTAS:**
• Pronta entrega: 2-3 dias úteis
• Personalizada: 7-10 dias úteis
• Emergência: 24h (acréscimo 30%)

��� **CONDIÇÕES FLEXÍVEIS:** Garantia de 1 ano, troca em 30 dias.`
  };
  
  return respostas[persona] || respostas['Mariana'];
};

// ========== ROTAS ADICIONAIS ==========
app.get('/api/saude', (req, res) => {
  res.json({
    status: 'online',
    sistema: 'Ótica CDO - IA Conversacional',
    apis_ativas: {
      deepseek: APIS_CONFIG.deepseek.active,
      huggingface: APIS_CONFIG.huggingface.active
    },
    timestamp: new Date().toISOString()
  });
});

app.post('/api/teste-ia', async (req, res) => {
  const teste = await queryDeepSeek('Responda apenas "SISTEMA OPERACIONAL"');
  
  res.json({
    deepseek: teste ? 'OPERACIONAL' : 'INDISPONIVEL',
    recomendacao: teste ? '✅ Sistema pronto para uso' : '⚠️ Configure chave DeepSeek',
    link_configuracao: 'https://platform.deepseek.com/api_keys'
  });
});

// ========== INICIALIZAÇÃO ==========
app.listen(PORT, () => {
  console.log(`
  ��� SISTEMA IA CONVERSACIONAL - ÓTICA CDO
  ========================================
  ��� Porta: ${PORT}
  ��� DeepSeek: ${APIS_CONFIG.deepseek.active ? '✅ CONFIGURADO' : '⚠️  NÃO CONFIGURADO'}
  ��� Hugging Face: ${APIS_CONFIG.huggingface.active ? '✅ CONFIGURADO' : '⚠️  NÃO CONFIGURADO'}
  ��� Personas: Dra. Camila, Eduardo, Mariana
  
  ��� Endpoints:
  • Conversa: POST http://localhost:${PORT}/api/conversa
  • Saúde: GET http://localhost:${PORT}/api/saude
  • Teste: POST http://localhost:${PORT}/api/teste-ia
  
  ⚡ Modo: ${APIS_CONFIG.deepseek.active ? 'IA REAL' : 'FALLBACK RICO'}
  `);
  
  if (!APIS_CONFIG.deepseek.active) {
    console.log('\n⚠️  CONFIGURE UMA IA GRATUITA:');
    console.log('1. Acesse: https://platform.deepseek.com/api_keys');
    console.log('2. Crie uma API Key gratuita');
    console.log('3. Adicione no .env: DEEPSEEK_API_KEY=sua_chave');
    console.log('4. Reinicie o servidor');
  }
});
