
export enum Category {
  MASCULINO = 'Masculino',
  FEMININO = 'Feminino',
  INFANTIL = 'Infantil',
  SOLAR = 'Solar'
}

export interface Frame {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  
  // Categorization
  gender: 'Masculino' | 'Feminino' | 'Infantil' | 'Unissex';
  usage: 'Receituário' | 'Solar' | 'Lente de Contato';
  
  // Physical attributes
  shape: 'Gatinho' | 'Quadrado' | 'Retangular' | 'Redondo' | 'Oval' | 'Aviador';
  faceShape: 'Coração' | 'Oval' | 'Quadrado' | 'Redondo' | 'Retangular' | 'Triangular';
  material: 'Acetato' | 'Metal' | 'Injetado' | 'Acetato e metal' | 'Titanio';
  frameColor: 'Preto' | 'Demi marrom' | 'Azul' | 'Vermelho' | 'Marrom' | 'Dourado' | 'Prata' | 'Tartaruga' | 'Rose';
  
  // Dimensions (mm)
  lensWidth: number; // Largura da Lente
  bridgeSize: number; // Tamanho da Ponte
  templeLength: number; // Comprimento da Haste
  
  // Extra
  highPrescriptionCompatible: boolean; // Graus Altos
  weight: string;
}

export interface LensOption {
  id: string;
  type: string;
  material: string;
  price: number;
  features: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface Persona {
  id: string;
  name: string;
  role: string; // Ex: Especialista em Visagismo, Optometrista Técnica
  description: string; // Descrição curta da personalidade
  systemPrompt: string; // Instrução específica para a IA
  color: string; // Cor do avatar
}
