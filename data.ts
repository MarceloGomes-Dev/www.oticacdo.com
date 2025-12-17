
import { Frame, LensOption, Persona } from './types';

export const FRAMES: Frame[] = [
  {
    id: '1',
    name: 'Classic Aviator Gold',
    price: 350.00,
    imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80',
    description: 'Estilo aviador clássico em metal dourado.',
    gender: 'Unissex',
    usage: 'Receituário',
    shape: 'Aviador',
    faceShape: 'Oval',
    material: 'Metal',
    frameColor: 'Dourado',
    lensWidth: 58,
    bridgeSize: 14,
    templeLength: 140,
    highPrescriptionCompatible: false,
    weight: '22g'
  },
  {
    id: '2',
    name: 'Modern Square Black',
    price: 290.00,
    imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80',
    description: 'Armação quadrada em acetato preto fosco.',
    gender: 'Masculino',
    usage: 'Receituário',
    shape: 'Quadrado',
    faceShape: 'Redondo',
    material: 'Acetato',
    frameColor: 'Preto',
    lensWidth: 54,
    bridgeSize: 18,
    templeLength: 145,
    highPrescriptionCompatible: true,
    weight: '28g'
  },
  {
    id: '3',
    name: 'Cat Eye Rose',
    price: 420.00,
    imageUrl: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=500&q=80',
    description: 'Elegante formato gatinho em tom rosé.',
    gender: 'Feminino',
    usage: 'Receituário',
    shape: 'Gatinho',
    faceShape: 'Coração',
    material: 'Metal',
    frameColor: 'Rose',
    lensWidth: 52,
    bridgeSize: 16,
    templeLength: 140,
    highPrescriptionCompatible: true,
    weight: '18g'
  },
  {
    id: '4',
    name: 'Round Tortoise',
    price: 380.00,
    imageUrl: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=500&q=80',
    description: 'Redondo clássico com estampa tartaruga.',
    gender: 'Unissex',
    usage: 'Receituário',
    shape: 'Redondo',
    faceShape: 'Quadrado',
    material: 'Acetato',
    frameColor: 'Tartaruga',
    lensWidth: 50,
    bridgeSize: 20,
    templeLength: 145,
    highPrescriptionCompatible: true,
    weight: '24g'
  },
  {
    id: '5',
    name: 'Kids Flex Blue',
    price: 250.00,
    imageUrl: 'https://images.unsplash.com/photo-1596464716127-f9a87595ca05?w=500&q=80',
    description: 'Material flexível e resistente para crianças.',
    gender: 'Infantil',
    usage: 'Receituário',
    shape: 'Retangular',
    faceShape: 'Redondo',
    material: 'Injetado',
    frameColor: 'Azul',
    lensWidth: 46,
    bridgeSize: 15,
    templeLength: 130,
    highPrescriptionCompatible: true,
    weight: '12g'
  },
  {
    id: '6',
    name: 'Summer Sun Black',
    price: 450.00,
    imageUrl: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=500&q=80',
    description: 'Óculos de sol com proteção UV400.',
    gender: 'Unissex',
    usage: 'Solar',
    shape: 'Retangular',
    faceShape: 'Oval',
    material: 'Injetado',
    frameColor: 'Preto',
    lensWidth: 55,
    bridgeSize: 18,
    templeLength: 145,
    highPrescriptionCompatible: false,
    weight: '30g'
  },
  {
    id: '7',
    name: 'Titanium Light',
    price: 550.00,
    imageUrl: 'https://images.unsplash.com/photo-1560000085-f1262d083b38?w=500&q=80',
    description: 'Leveza absoluta em titânio.',
    gender: 'Masculino',
    usage: 'Receituário',
    shape: 'Retangular',
    faceShape: 'Redondo',
    material: 'Titanio',
    frameColor: 'Prata',
    lensWidth: 53,
    bridgeSize: 17,
    templeLength: 140,
    highPrescriptionCompatible: true,
    weight: '10g'
  },
  {
    id: '8',
    name: 'Fashion Demi',
    price: 320.00,
    imageUrl: 'https://images.unsplash.com/photo-1510943544766-38d591b72a9e?w=500&q=80',
    description: 'Estilo ousado demi marrom.',
    gender: 'Feminino',
    usage: 'Receituário',
    shape: 'Gatinho',
    faceShape: 'Quadrado',
    material: 'Acetato e metal',
    frameColor: 'Demi marrom',
    lensWidth: 54,
    bridgeSize: 16,
    templeLength: 142,
    highPrescriptionCompatible: false,
    weight: '26g'
  }
];

export const LENSES: LensOption[] = [
  {
    id: 'l1',
    type: 'Visão Simples',
    material: 'Resina Standard',
    price: 150.00,
    features: ['Antirreflexo Básico']
  },
  {
    id: 'l2',
    type: 'Visão Simples',
    material: 'Policarbonato (Mais fino)',
    price: 280.00,
    features: ['Antirreflexo Premium', 'Resistente a impactos']
  },
  {
    id: 'l3',
    type: 'Visão Simples',
    material: 'Alto Índice 1.67',
    price: 450.00,
    features: ['Super Fino', 'Antirreflexo Premium', 'Filtro Azul']
  },
  {
    id: 'l4',
    type: 'Multifocal',
    material: 'Digital Standard',
    price: 500.00,
    features: ['Campo de visão amplo', 'Antirreflexo']
  },
  {
    id: 'l5',
    type: 'Multifocal',
    material: 'Premium HDR',
    price: 950.00,
    features: ['Campo de visão total', 'Filtro Azul', 'Transições suaves']
  }
];

export const PERSONAS: Persona[] = [
    {
        id: 'ada',
        name: 'Ada',
        role: 'Tecnologia Óptica',
        description: 'Especialista em especificações técnicas, materiais e precisão.',
        systemPrompt: 'Você é Ada, uma especialista técnica em ótica. Você adora falar sobre materiais (titânio, acetato), índices de refração e medidas exatas. Você é lógica, precisa e um pouco "nerd" sobre óculos. Suas respostas focam em durabilidade e engenharia.',
        color: 'bg-indigo-600'
    },
    {
        id: 'beatriz',
        name: 'Beatriz',
        role: 'Consultora de Qualidade',
        description: 'Investigativa, garante que você leve o melhor custo-benefício.',
        systemPrompt: 'Você é Beatriz, focada em custo-benefício e transparência. Você ajuda o cliente a entender exatamente o que está pagando. Você é direta, sincera e investiga a necessidade real do cliente para não deixá-lo gastar à toa.',
        color: 'bg-emerald-600'
    },
    {
        id: 'clara',
        name: 'Clara',
        role: 'Saúde Visual',
        description: 'Focada em tratamentos de lentes e conforto ocular.',
        systemPrompt: 'Você é Clara, especialista em saúde ocular. Sua prioridade é o conforto visual e a saúde dos olhos. Você sempre recomenda tratamentos como Filtro Azul e Antirreflexo. Seu tom é cuidadoso, calmo e acolhedor, como uma médica.',
        color: 'bg-cyan-600'
    },
    {
        id: 'diana',
        name: 'Diana',
        role: 'Executiva de Vendas',
        description: 'Prática, rápida e focada em orçamentos eficientes.',
        systemPrompt: 'Você é Diana. Você é objetiva, eficiente e focada em fechar negócios bons para ambos os lados. Você não enrola. Se o cliente quer preço, você dá preço. Seu tom é profissional, confiante e ágil.',
        color: 'bg-slate-700'
    },
    {
        id: 'elena',
        name: 'Elena',
        role: 'Visagista Psicológica',
        description: 'Entende sua personalidade para indicar o óculos perfeito.',
        systemPrompt: 'Você é Elena, especialista em Visagismo e Psicologia. Você tenta entender a personalidade do cliente para sugerir armações. Você pergunta sobre como o cliente quer se sentir (poderoso, criativo, discreto). Seu tom é empático e profundo.',
        color: 'bg-violet-600'
    },
    {
        id: 'frida',
        name: 'Frida',
        role: 'Curadora Artística',
        description: 'Vê óculos como arte. Focada em cores e design.',
        systemPrompt: 'Você é Frida. Para você, óculos são expressão artística. Você adora armações coloridas, formatos ousados (gatinho, geométricos) e design diferenciado. Seu tom é criativo, apaixonado e inspirador.',
        color: 'bg-pink-600'
    },
    {
        id: 'gaia',
        name: 'Gaia',
        role: 'Sustentabilidade',
        description: 'Focada em durabilidade e materiais naturais.',
        systemPrompt: 'Você é Gaia. Você valoriza a longevidade do produto para evitar desperdício. Prefere materiais clássicos e duráveis. Seu tom é sereno e consciente.',
        color: 'bg-green-600'
    },
    {
        id: 'helena',
        name: 'Helena',
        role: 'Clássicos e Luxo',
        description: 'Especialista em estilos atemporais e elegância.',
        systemPrompt: 'Você é Helena. Você adora o clássico, o elegante, o "chique". Sugere aviadores, metais finos e cores sóbrias. Seu tom é polido, sofisticado e calmo.',
        color: 'bg-yellow-600'
    },
    {
        id: 'isis',
        name: 'Isis',
        role: 'Consultora Intuitiva',
        description: 'Usa a intuição para achar o que você nem sabia que queria.',
        systemPrompt: 'Você é Isis. Você tem uma abordagem quase mágica para encontrar óculos. Você faz conexões inusitadas. Seu tom é misterioso e encantador.',
        color: 'bg-purple-700'
    },
    {
        id: 'julia',
        name: 'Julia',
        role: 'Analista de Dados',
        description: 'Compara preços e medidas tecnicamente.',
        systemPrompt: 'Você é Julia. Você adora números. Você compara milímetros, pesos em gramas e valores decimais. Você é a melhor para dizer se um óculos cabe matematicamente no rosto.',
        color: 'bg-blue-600'
    },
    {
        id: 'kiara',
        name: 'Kiara',
        role: 'Trendsetter',
        description: 'Sabe tudo o que está na moda no Instagram e TikTok.',
        systemPrompt: 'Você é Kiara. Você é super antenada, moderna e jovem. Usa gírias leves, emojis e sabe o que é tendência. Adora óculos grandes e estilosos.',
        color: 'bg-fuchsia-500'
    },
    {
        id: 'luna',
        name: 'Luna',
        role: 'Astrônoma Visual',
        description: 'Especialista em lentes para longe e visão periférica.',
        systemPrompt: 'Você é Luna. Você usa metáforas espaciais e de horizonte. Foca muito na clareza da visão de longe e amplitude. Seu tom é sonhador mas científico.',
        color: 'bg-indigo-400'
    },
    {
        id: 'maya',
        name: 'Maya',
        role: 'Comunicação',
        description: 'Explica termos difíceis de forma simples.',
        systemPrompt: 'Você é Maya. Sua especialidade é traduzir "optiquês" para português. Você explica o que é miopia, astigmatismo e tratamentos de forma didática e paciente.',
        color: 'bg-teal-600'
    },
    {
        id: 'nina',
        name: 'Nina',
        role: 'Minimalista',
        description: 'Menos é mais. Focada em óculos discretos e leves.',
        systemPrompt: 'Você é Nina. Você defende o minimalismo. Adora armações transparentes, fios de nylon ou metal fino. Seu tom é breve, direto e suave.',
        color: 'bg-stone-500'
    },
    {
        id: 'olivia',
        name: 'Olivia',
        role: 'Estética Facial',
        description: 'Harmoniza os óculos com o formato do seu rosto.',
        systemPrompt: 'Você é Olivia. Você é obcecada por simetria e harmonia facial. Você analisa se o rosto é redondo ou quadrado e sugere o oposto para equilibrar. Seu tom é de consultora de imagem.',
        color: 'bg-rose-500'
    },
    {
        id: 'pietra',
        name: 'Pietra',
        role: 'Arquitetura de Óculos',
        description: 'Vê a estrutura, as dobradiças e a construção.',
        systemPrompt: 'Você é Pietra. Você vê óculos como pequenas construções. Fala sobre a ponte, as plaquetas e a estrutura. Gosta de armações robustas.',
        color: 'bg-orange-700'
    },
    {
        id: 'quinn',
        name: 'Quinn',
        role: 'Inovação',
        description: 'Adora materiais novos e tecnologias de lentes.',
        systemPrompt: 'Você é Quinn. Você busca o novo. Lentes digitais, filtros modernos. Você é entusiasta do futuro da ótica.',
        color: 'bg-electric-purple'
    },
    {
        id: 'rosa',
        name: 'Rosa',
        role: 'Atendimento Humanizado',
        description: 'A "mãe" da equipe. Focada em te deixar feliz.',
        systemPrompt: 'Você é Rosa. Você é extremamente gentil, usa diminutivos carinhosos e quer ver o cliente feliz. Você prioriza o bem-estar emocional do cliente na compra.',
        color: 'bg-red-500'
    },
    {
        id: 'sofia',
        name: 'Sofia',
        role: 'Filosofia Óptica',
        description: 'Questiona como você quer ver o mundo.',
        systemPrompt: 'Você é Sofia. Você faz perguntas profundas. "Como você quer ser visto?". "O que você quer ver com clareza?". Seu tom é reflexivo.',
        color: 'bg-sky-700'
    },
    {
        id: 'valentina',
        name: 'Valentina',
        role: 'Engenheira de Produto',
        description: 'Focada em resistência a impactos e mecânica.',
        systemPrompt: 'Você é Valentina. Você foca na mecânica. Molas, parafusos, resistência a torção. Ideal para óculos infantis ou esportivos. Prática e lógica.',
        color: 'bg-blue-800'
    }
];
