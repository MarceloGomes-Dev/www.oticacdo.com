// Dados completos da Ótica CDO
export const FRAMES = [
  {
    id: 'frame-001',
    name: 'Classic Black',
    price: 289.90,
    material: 'Acetato',
    shape: 'Retangular',
    frameColor: 'Preto',
    lensWidth: 52,
    bridgeSize: 18,
    templeLength: 140,
    weight: '25g',
    usage: 'Receituário',
    gender: 'Unissex',
    description: 'Armação clássica em acetato, ideal para graus altos'
  },
  {
    id: 'frame-002',
    name: 'Aviator Gold',
    price: 459.90,
    material: 'Metal',
    shape: 'Aviador',
    frameColor: 'Dourado',
    lensWidth: 58,
    bridgeSize: 16,
    templeLength: 145,
    weight: '22g',
    usage: 'Solar',
    gender: 'Unissex',
    description: 'Estilo aviador com lentes espelhadas opcionais'
  },
  {
    id: 'frame-003',
    name: 'Cat Eye Premium',
    price: 389.90,
    material: 'Acetato e metal',
    shape: 'Gatinho',
    frameColor: 'Tartaruga',
    lensWidth: 50,
    bridgeSize: 17,
    templeLength: 135,
    weight: '28g',
    usage: 'Receituário',
    gender: 'Feminino',
    description: 'Design elegante com detalhes em metal'
  },
  {
    id: 'frame-004',
    name: 'Sport Flex',
    price: 329.90,
    material: 'Titanio',
    shape: 'Redondo',
    frameColor: 'Azul',
    lensWidth: 54,
    bridgeSize: 19,
    templeLength: 150,
    weight: '18g',
    usage: 'Esportivo',
    gender: 'Masculino',
    description: 'Ultra leve e flexível, ideal para atividades físicas'
  },
  {
    id: 'frame-005',
    name: 'Minimalist Silver',
    price: 519.90,
    material: 'Titanio',
    shape: 'Oval',
    frameColor: 'Prata',
    lensWidth: 51,
    bridgeSize: 17,
    templeLength: 142,
    weight: '16g',
    usage: 'Receituário',
    gender: 'Unissex',
    description: 'Design minimalista em titânio puro, hipoalergênico'
  }
];

export const LENSES = [
  {
    id: 'lens-001',
    type: 'Single Vision',
    material: 'Resina Index 1.56',
    price: 149.90,
    features: ['Anti-risco', 'Proteção UV 100%'],
    description: 'Lente básica para miopia ou hipermetropia'
  },
  {
    id: 'lens-002',
    type: 'Single Vision',
    material: 'Resina Index 1.61',
    price: 219.90,
    features: ['Anti-risco', 'UV 100%', 'Antirreflexo'],
    description: 'Lente mais fina com tratamento antirreflexo'
  },
  {
    id: 'lens-003',
    type: 'Multifocal/Degressiva',
    material: 'Resina Index 1.67',
    price: 489.90,
    features: ['Anti-risco', 'UV 100%', 'Antirreflexo', 'Blue Light'],
    description: 'Para presbiopia (vista cansada), lente progressiva'
  },
  {
    id: 'lens-004',
    type: 'Fotossensível',
    material: 'Resina Index 1.59',
    price: 329.90,
    features: ['Escurece ao sol', 'UV 100%', 'Anti-risco'],
    description: 'Lente que escurece conforme a luz solar'
  },
  {
    id: 'lens-005',
    type: 'Polarizada',
    material: 'Policarbonato',
    price: 279.90,
    features: ['Elimina reflexos', 'UV 100%', 'Cores mais vivas'],
    description: 'Ideal para dirigir e atividades ao ar livre'
  }
];

export const TREATMENTS = [
  { name: 'Antirreflexo', price: 89.90, description: 'Reduz reflexos e melhora transparência' },
  { name: 'Blue Light', price: 119.90, description: 'Proteção contra luz azul de telas' },
  { name: 'Anti-embaçante', price: 149.90, description: 'Evita embaçamento com máscaras' },
  { name: 'Espelhamento', price: 79.90, description: 'Efeito espelhado estético' },
  { name: 'Hidrofóbico', price: 69.90, description: 'Repele água e gordura' }
];

export const PERSONAS = [
  {
    id: 'persona-001',
    name: 'Dra. Camila',
    role: 'Optometrista Técnica',
    description: 'Especialista em lentes e saúde ocular',
    systemPrompt: 'Você é uma optometrista com 15 anos de experiência. Foca em precisão técnica, saúde ocular e adequação de lentes. Explica detalhes técnicos de forma clara.',
    expertise: ['Graus altos', 'Doenças oculares', 'Lentes especiais'],
    color: '#3B82F6'
  },
  {
    id: 'persona-002',
    name: 'Eduardo',
    role: 'Especialista em Visagismo',
    description: 'Consultor de estilo e formato de rosto',
    systemPrompt: 'Você é um especialista em visagismo e design facial. Analisa formato do rosto, personalidade e estilo de vida para sugerir armações. Foca em estética e autoestima.',
    expertise: ['Formato de rosto', 'Estilo pessoal', 'Tendências'],
    color: '#10B981'
  },
  {
    id: 'persona-003',
    name: 'Mariana',
    role: 'Consultora Comercial',
    description: 'Especialista em orçamentos e condições',
    systemPrompt: 'Você é uma consultora comercial focada em encontrar a melhor relação custo-benefício. Conhece todos os produtos, promoções e formas de pagamento. É prática e direta.',
    expertise: ['Orçamentos', 'Promoções', 'Formas de pagamento'],
    color: '#8B5CF6'
  }
];

// Formas de pagamento
export const PAYMENT_METHODS = [
  { method: 'À vista (PIX/Dinheiro)', discount: '10%' },
  { method: 'Cartão de crédito', installments: 'até 10x sem juros' },
  { method: 'Cartão de débito', discount: '3%' },
  { method: 'Financiamento', details: 'parcelado em 12x' }
];

// Tempos de entrega
export const DELIVERY_TIMES = [
  { type: 'Lente pronta', time: '1-2 dias úteis' },
  { type: 'Lente personalizada', time: '7-10 dias úteis' },
  { type: 'Armação importada', time: '15-20 dias úteis' },
  { type: 'Emergência', time: '24h (acréscimo 30%)' }
];
