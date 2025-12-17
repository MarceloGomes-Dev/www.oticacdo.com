import React from 'react';
import { LENSES } from '../data';
import { CheckCircle } from 'lucide-react';

interface LensTableProps {
    onNavigateToBudget: (message: string) => void;
}

const LensTable: React.FC<LensTableProps> = ({ onNavigateToBudget }) => {
  const handleSelectLens = (lensName: string, price: number) => {
      const message = `Gostaria de incluir as lentes "${lensName}" (R$ ${price.toFixed(2)}) no meu orçamento.`;
      onNavigateToBudget(message);
  };

  return (
    <div className="bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-blue-900 sm:text-4xl uppercase tracking-tight">
            Tabela de Lentes
          </h2>
           <div className="w-24 h-1 bg-orange-500 mx-auto mt-4 mb-4 rounded-full"></div>
          <p className="text-lg text-slate-600">
            Qualidade e tecnologia para sua saúde visual.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LENSES.map((lens) => (
            <div key={lens.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-t-8 border-orange-500 flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 {/* Decorative Circle */}
                 <div className="w-24 h-24 bg-orange-500 rounded-full blur-xl"></div>
              </div>

              <div className="flex justify-between items-start mb-6 z-10">
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase">{lens.type}</h3>
                  <p className="text-sm text-slate-500 font-medium">{lens.material}</p>
                </div>
                <div className={`text-[10px] font-black uppercase px-2 py-1 rounded text-white ${
                    lens.id.startsWith('l4') || lens.id.startsWith('l5') ? 'bg-blue-900' : 'bg-blue-500'
                }`}>
                  {lens.id.startsWith('l4') || lens.id.startsWith('l5') ? 'Multifocal' : 'Visão Simples'}
                </div>
              </div>
              
              <div className="mb-6 z-10">
                 <span className="text-sm text-slate-400 block mb-1">Investimento:</span>
                 <div className="text-4xl font-black text-orange-600">
                    R$ {lens.price.toFixed(2).replace('.', ',')}
                 </div>
              </div>

              <ul className="space-y-4 mb-8 flex-grow z-10 border-t border-slate-100 pt-6">
                {lens.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-slate-700 text-sm font-medium">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={() => handleSelectLens(lens.material, lens.price)}
                className="w-full bg-blue-900 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 uppercase tracking-wide z-10 shadow-md"
              >
                Selecionar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LensTable;