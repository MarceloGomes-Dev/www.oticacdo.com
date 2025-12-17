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

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY 
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'online',
    service: '√ìtica CDO - API de Or√ßamentos',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/orcamento', async (req, res) => {
  try {
    const { mensagem, contexto } = req.body;
    
    if (!mensagem || typeof mensagem !== 'string') {
      return res.status(400).json({ 
        error: 'A mensagem √© obrigat√≥ria e deve ser um texto' 
      });
    }

    console.log(`ÔøΩÔøΩ Nova solicita√ß√£o de or√ßamento: ${mensagem.substring(0, 50)}...`);

    const prompt = `
      Voc√™ √© um assistente especializado em or√ßamentos para uma √≥tica.
      Contexto: ${contexto || 'Cliente solicitando or√ßamento de √≥culos'}
      
      Instru√ß√µes:
      1. Analise a solicita√ß√£o: "${mensagem}"
      2. Forne√ßa um or√ßamento detalhado considerando:
         - Tipo de lente (simples, bifocal, multifocal, antirreflexo)
         - Tipo de arma√ß√£o (metal, acetato, flex√≠vel)
         - Tratamentos (prote√ß√£o UV, blue light, fotossens√≠vel)
         - Prazos de entrega
         - Formas de pagamento
      3. Seja espec√≠fico com valores aproximados
      4. Sugira op√ß√µes de diferentes faixas de pre√ßo
      
      Formato da resposta:
      ÔøΩÔøΩ OR√áAMENTO DETALHADO
      
      [Detalhamento dos custos]
      
      ‚è∞ PRAZOS:
      
      Ì≤≥ FORMAS DE PAGAMENTO:
    `;

    // MODELO ATUALIZADO: gemini-1.5-pro ou gemini-1.0-pro
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro',  // ‚Üê MODELO CORRIGIDO AQUI
      contents: [{ 
        role: 'user', 
        parts: [{ text: prompt }] 
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      }
    });

    const resposta = response.text;
    
    console.log('‚úÖ Or√ßamento gerado com sucesso');

    res.json({
      sucesso: true,
      resposta: resposta,
      metadata: {
        modelo: 'gemini-1.5-pro',
        tokens: resposta.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('‚ùå Erro no processamento:', error.message);
    
    // Se gemini-1.5-pro falhar, tenta gemini-1.0-pro
    if (error.message.includes('model') || error.message.includes('not found')) {
      try {
        console.log('Ì¥Ñ Tentando com modelo gemini-1.0-pro...');
        const response = await ai.models.generateContent({
          model: 'gemini-1.0-pro',
          contents: [{ 
            role: 'user', 
            parts: [{ text: prompt }] 
          }]
        });
        
        return res.json({
          sucesso: true,
          resposta: response.text,
          metadata: {
            modelo: 'gemini-1.0-pro',
            tokens: response.text.length
          }
        });
      } catch (secondError) {
        console.error('‚ùå Segundo modelo tamb√©m falhou:', secondError.message);
      }
    }
    
    res.status(500).json({
      sucesso: false,
      error: 'Erro ao processar com IA',
      detalhes: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.post('/api/teste', async (req, res) => {
  try {
    // Teste com modelo atualizado
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro',  // ‚Üê MODELO CORRIGIDO
      contents: [{ 
        role: 'user', 
        parts: [{ text: 'Responda apenas com "API funcionando corretamente"' }] 
      }]
    });
    
    res.json({ 
      status: 'OK',
      resposta: response.text,
      apiKeyConfigurada: !!process.env.GEMINI_API_KEY,
      modelo: 'gemini-1.5-pro'
    });
  } catch (error) {
    // Se falhar, tenta com o modelo antigo
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-1.0-pro',
        contents: [{ 
          role: 'user', 
          parts: [{ text: 'Responda apenas com "API funcionando corretamente"' }] 
        }]
      });
      
      res.json({ 
        status: 'OK',
        resposta: response.text,
        apiKeyConfigurada: !!process.env.GEMINI_API_KEY,
        modelo: 'gemini-1.0-pro'
      });
    } catch (secondError) {
      res.status(500).json({ 
        error: 'Falha em todos os modelos',
        detalhes: error.message + ' | ' + secondError.message
      });
    }
  }
});

app.use((err, req, res, next) => {
  console.error('Ìªë Erro n√£o tratado:', err);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    referencia: req.headers['x-request-id'] || Date.now()
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Rota n√£o encontrada',
    rota: req.originalUrl 
  });
});

app.listen(PORT, () => {
  console.log(`
  Ì∫Ä Servidor backend da √ìtica CDO iniciado!
  Ì≥ç Porta: ${PORT}
  Ìºê Ambiente: ${process.env.NODE_ENV || 'development'}
  Ì¥ó Health check: http://localhost:${PORT}/api/health
  Ì¥ó Teste API: http://localhost:${PORT}/api/teste
  `);
  
  if (!process.env.GEMINI_API_KEY) {
    console.warn('‚ö†Ô∏è  Aviso: GEMINI_API_KEY n√£o configurada no .env');
  } else {
    console.log('‚úÖ GEMINI_API_KEY configurada');
  }
});
