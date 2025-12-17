import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: [
    'https://marcelogomes-dev.github.io',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());

// Inicializa Gemini (se chave existir)
const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY 
}) : null;

// Resposta de fallback para quando Gemini falha
const gerarOrcamentoFallback = (mensagem) => {
  return `��� ORÇAMENTO ÓTICA CDO (Resposta Automática)

Baseado na sua solicitação: "${mensagem.substring(0, 50)}..."

��� OPÇÕES DE ARMAÇÃO:
• Linha Básica (Acetato): R$ 189,90 - R$ 289,90
• Linha Premium (Metal/Titânio): R$ 349,90 - R$ 599,90
• Linha Esportiva (Flexível): R$ 279,90 - R$ 459,90

��� TIPOS DE LENTE:
• Single Vision (Grau simples): R$ 149,90
• Bifocal/Multifocal: R$ 299,90 - R$ 499,90
• + Tratamento Anti-Reflexo: R$ 89,90
• + Proteção Blue Light: R$ 119,90
• + Fotossensível: R$ 199,90

⏱️ PRAZO DE ENTREGA: 7 a 14 dias úteis
��� FRETE GRÁTIS para toda a região

�� FORMAS DE PAGAMENTO:
• À vista (10% desconto)
• Parcelado em até 10x sem juros
• PIX (5% desconto)

��� Para um orçamento preciso com suas medidas exatas, visite nossa loja ou agende uma consulta pelo WhatsApp!

*Este é um orçamento estimado. Valores podem variar conforme especificações técnicas.*`;
};

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'online',
    service: 'Ótica CDO - API de Orçamentos',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    modoOperacao: process.env.GEMINI_API_KEY ? 'gemini_tentativa' : 'fallback_automatico'
  });
});

app.post('/api/orcamento', async (req, res) => {
  console.log('��� Recebendo pedido de orçamento:', req.body.mensagem?.substring(0, 50));
  
  try {
    const { mensagem, contexto } = req.body;
    
    if (!mensagem || typeof mensagem !== 'string') {
      return res.status(400).json({ 
        sucesso: false,
        error: 'A mensagem é obrigatória' 
      });
    }

    // Se não tem chave Gemini ou optou por não usar, vai direto para fallback
    if (!process.env.GEMINI_API_KEY) {
      console.log('⚠️  Sem chave Gemini - usando fallback');
      const respostaFallback = gerarOrcamentoFallback(mensagem);
      
      return res.json({
        sucesso: true,
        resposta: respostaFallback,
        metadata: {
          modelo: 'fallback_simulado',
          motivo: 'Chave Gemini não configurada',
          timestamp: new Date().toISOString()
        }
      });
    }

    // TENTAR GEMINI PRIMEIRO
    console.log('��� Tentando Gemini API...');
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash', // Modelo mais estável
        contents: [{ 
          role: 'user', 
          parts: [{ 
            text: `Você é consultor especializado da Ótica CDO. 
            Contexto do cliente: ${contexto || 'Busca por óculos'}
            Solicitação específica: "${mensagem}"
            
            Forneça um orçamento detalhado incluindo:
            1. Opções de armação com faixas de preço
            2. Tipos de lente e tratamentos
            3. Prazos de entrega estimados
            4. Formas de pagamento disponíveis
            5. Recomendações personalizadas
            
            Formato: Seja claro, use tópicos e valores em R$.`
          }] 
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      });

      const respostaGemini = response.text;
      console.log('✅ Gemini respondeu com sucesso');
      
      return res.json({
        sucesso: true,
        resposta: respostaGemini,
        metadata: {
          modelo: 'gemini-1.5-flash',
          fonte: 'gemini_ai',
          timestamp: new Date().toISOString()
        }
      });
      
    } catch (erroGemini) {
      console.warn('❌ Gemini falhou:', erroGemini.message);
      
      // ERRO 429 (Quota) ou outros - usar fallback
      if (erroGemini.message.includes('429') || erroGemini.message.includes('quota')) {
        console.log('��� Cota excedida - usando fallback personalizado');
        const respostaFallback = gerarOrcamentoFallback(mensagem);
        
        return res.json({
          sucesso: true,
          resposta: respostaFallback,
          metadata: {
            modelo: 'fallback_quota_excedida',
            motivo: 'Cota Gemini excedida. ' + erroGemini.message.split('.')[0],
            timestamp: new Date().toISOString()
          }
        });
      }
      
      // Outros erros da Gemini
      throw erroGemini;
    }

  } catch (error) {
    console.error('��� Erro no processamento:', error.message);
    
    // FALLBACK FINAL para qualquer erro não tratado
    const respostaFinal = gerarOrcamentoFallback(req.body.mensagem || 'Erro desconhecido');
    
    return res.json({
      sucesso: true,
      resposta: respostaFinal,
      metadata: {
        modelo: 'fallback_erro_generico',
        motivo: 'Erro: ' + error.message.substring(0, 100),
        timestamp: new Date().toISOString()
      }
    });
  }
});

app.post('/api/teste', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        status: 'FALLBACK_MODE',
        mensagem: 'Chave Gemini não configurada. Sistema operando em modo fallback.',
        timestamp: new Date().toISOString()
      });
    }
    
    // Teste simples com fallback
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ 
        role: 'user', 
        parts: [{ text: 'Responda apenas "API OK"' }] 
      }]
    });
    
    res.json({ 
      status: 'GEMINI_OK',
      resposta: response.text,
      modelo: 'gemini-1.5-flash'
    });
    
  } catch (error) {
    res.json({ 
      status: 'GEMINI_OFFLINE',
      mensagem: 'Gemini offline. Modo fallback ativo.',
      erro: error.message.substring(0, 100)
    });
  }
});

// Nova rota para forçar modo fallback (útil para testes)
app.post('/api/fallback-test', (req, res) => {
  const { mensagem } = req.body;
  const resposta = gerarOrcamentoFallback(mensagem || 'Teste de fallback');
  
  res.json({
    sucesso: true,
    resposta: resposta,
    metadata: {
      fonte: 'fallback_forcado',
      timestamp: new Date().toISOString()
    }
  });
});

app.listen(PORT, () => {
  console.log(`
  ��� Backend Ótica CDO Iniciado!
  ��� Porta: ${PORT}
  ��� Status Gemini: ${process.env.GEMINI_API_KEY ? '✅ CONFIGURADA' : '⚠️  NÃO CONFIGURADA (Modo Fallback)'}
  ��� Health Check: http://localhost:${PORT}/api/health
  ��� Modo: ${process.env.GEMINI_API_KEY ? 'Tentará Gemini primeiro' : 'Apenas Fallback'}
  
  ⚠️  DICA: Se a Gemini falhar (erro 429), o sistema automaticamente
       usará respostas simuladas. Seu site SEMPRE funcionará!
  `);
});
