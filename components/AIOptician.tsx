
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RefreshCw, Instagram, Check, MessageCircle } from 'lucide-react';
import { ChatMessage, Persona } from '../types';
import { PERSONAS } from '../data';
import { sendMessageToGemini, resetChat } from '../services/geminiService';

interface AIOpticianProps {
    initialMessage?: string;
}

const AIOptician: React.FC<AIOpticianProps> = ({ initialMessage }) => {
  // Initialize with a random persona
  const [currentPersona, setCurrentPersona] = useState<Persona>(() => {
      const randomIndex = Math.floor(Math.random() * PERSONAS.length);
      return PERSONAS[randomIndex];
  });
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedStore, setCopiedStore] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting
  useEffect(() => {
    resetChat(); // Reset gemini session
    setMessages([{
        id: 'welcome',
        role: 'model',
        text: `Olá! Eu sou a ${currentPersona.name}, sua Consultora Virtual. ${currentPersona.description} Como posso ajudar com seu orçamento hoje?`
    }]);
  }, [currentPersona]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
      if (initialMessage) {
          setInput(initialMessage);
      }
  }, [initialMessage]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    setIsLoading(true);

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: userText
    };
    setMessages(prev => [...prev, userMessage]);

    // Get AI response passing the current persona
    try {
      const responseText = await sendMessageToGemini(userText, currentPersona);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Erro na interface:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'Desculpe, tive um problema de conexão. Por favor, verifique sua chave de API ou tente novamente em instantes.',
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    // Select a new random persona on reset for variety
    const randomIndex = Math.floor(Math.random() * PERSONAS.length);
    const newPersona = PERSONAS[randomIndex];
    
    resetChat();
    setCurrentPersona(newPersona);
    // The useEffect will trigger the welcome message for the new persona
  };

  const generateHistoryText = () => {
    return messages
      .filter(m => !m.isError && m.id !== 'welcome')
      .map(m => `${m.role === 'user' ? '👤 Cliente' : `👓 ${currentPersona.name}`}: ${m.text}`)
      .join('\n\n');
  };

  const handleInstagramContact = (handle: string) => {
    const history = generateHistoryText();
    const clipboardText = `Olá! Fui atendido pela Consultora Virtual ${currentPersona.name} e gostaria de finalizar este orçamento:\n\n${history}`;

    navigator.clipboard.writeText(clipboardText).then(() => {
      setCopiedStore(handle);
      setTimeout(() => setCopiedStore(null), 3000);
      window.open(`https://instagram.com/${handle}`, '_blank');
    }).catch(err => {
      console.error('Falha ao copiar:', err);
      window.open(`https://instagram.com/${handle}`, '_blank');
    });
  };

  const handleWhatsAppContact = () => {
    const history = generateHistoryText();
    const clipboardText = `Olá! Fui atendido pela Consultora Virtual ${currentPersona.name} e gostaria de falar com um humano sobre este orçamento:\n\n${history}`;
    
    navigator.clipboard.writeText(clipboardText).then(() => {
        setCopiedStore('whatsapp');
        setTimeout(() => setCopiedStore(null), 3000);
        window.open('https://wa.me/5585999999999', '_blank');
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col h-[700px]">
        
        {/* Header - Simplified for "Consultora Virtual" */}
        <div className="bg-slate-900 p-6 flex items-center justify-between border-b-4 border-orange-500">
          
          <div className="flex items-center text-white">
            <div className={`p-3 rounded-full mr-4 shadow-lg border-2 border-white ${currentPersona.color} transition-colors duration-500`}>
               <Bot className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                  <h2 className="font-bold text-2xl tracking-wide">{currentPersona.name}</h2>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                      IA
                  </span>
              </div>
              {/* Unified Title */}
              <p className="text-sm text-blue-200 uppercase tracking-wider font-semibold opacity-90 mt-1">
                  Consultora Virtual
              </p>
            </div>
          </div>

          <button 
              onClick={handleReset}
              className="text-white/80 hover:text-white hover:bg-white/10 p-3 rounded-full transition group"
              title="Nova Consulta"
          >
              <RefreshCw className="h-6 w-6 group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 relative">
          
          {/* Subtle Bio Banner */}
          <div className="flex justify-center mb-6">
             <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 shadow-sm text-xs text-slate-500 flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-orange-400" />
                <span className="italic">{currentPersona.description}</span>
             </div>
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mx-2 shadow-sm transition-colors duration-500 ${
                  msg.role === 'user' ? 'bg-orange-100' : `${currentPersona.color}`
                }`}>
                  {msg.role === 'user' ? <User className="h-6 w-6 text-orange-600" /> : <Bot className="h-6 w-6 text-white" />}
                </div>
                
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-line ${
                  msg.role === 'user' 
                    ? 'bg-orange-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                } ${msg.isError ? 'bg-red-50 text-red-600 border-red-200' : ''}`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex flex-row">
                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mx-2 ${currentPersona.color}`}>
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-slate-200">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={`Fale com ${currentPersona.name}...`}
              className="flex-1 p-4 border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-orange-600 text-white p-4 rounded-xl hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <Send className="h-6 w-6" />
            </button>
          </div>
          
          {/* Social Links / Send to Store */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500 mb-3 font-bold text-center sm:text-left uppercase tracking-wider">
              Gostou do atendimento da {currentPersona.name}?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start flex-wrap">
              <button 
                onClick={() => handleInstagramContact('oticacdo_fortaleza')}
                className={`flex items-center justify-center text-xs font-bold px-4 py-3 rounded-lg transition border uppercase tracking-wide ${
                   copiedStore === 'oticacdo_fortaleza' 
                   ? 'bg-green-100 text-green-700 border-green-300' 
                   : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 hover:border-orange-400'
                }`}
              >
                {copiedStore === 'oticacdo_fortaleza' ? <Check className="h-4 w-4 mr-2" /> : <Instagram className="h-4 w-4 mr-2 text-pink-600" />}
                Loja Fortaleza
              </button>

              <button 
                onClick={() => handleInstagramContact('oticacdo_caucaia')}
                className={`flex items-center justify-center text-xs font-bold px-4 py-3 rounded-lg transition border uppercase tracking-wide ${
                   copiedStore === 'oticacdo_caucaia' 
                   ? 'bg-green-100 text-green-700 border-green-300' 
                   : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 hover:border-orange-400'
                }`}
              >
                {copiedStore === 'oticacdo_caucaia' ? <Check className="h-4 w-4 mr-2" /> : <Instagram className="h-4 w-4 mr-2 text-pink-600" />}
                Loja Caucaia
              </button>

              <button 
                onClick={handleWhatsAppContact}
                className={`flex items-center justify-center text-xs font-bold px-4 py-3 rounded-lg transition border text-white uppercase tracking-wide shadow-md ${
                   copiedStore === 'whatsapp' 
                   ? 'bg-green-700 border-green-800' 
                   : 'bg-green-600 hover:bg-green-700 border-green-600'
                }`}
              >
                {copiedStore === 'whatsapp' ? <Check className="h-4 w-4 mr-2" /> : <MessageCircle className="h-4 w-4 mr-2" />}
                Enviar p/ WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIOptician;
