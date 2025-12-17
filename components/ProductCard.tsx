import React from 'react';
import { Frame } from '../types';

interface ProductCardProps {
  frame: Frame;
  onViewDetails: (frame: Frame) => void;
  onAddToBudget: (frame: Frame) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ frame, onViewDetails, onAddToBudget }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-slate-100 group">
      <div className="h-56 overflow-hidden relative cursor-pointer" onClick={() => onViewDetails(frame)}>
        <img 
          src={frame.imageUrl} 
          alt={frame.name} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-blue-900 text-white text-[10px] font-black uppercase px-2 py-1 rounded tracking-wider shadow-md">
          {frame.usage}
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-slate-900 mb-1 cursor-pointer hover:text-orange-600 transition" onClick={() => onViewDetails(frame)}>
            {frame.name}
        </h3>
        <p className="text-xs text-slate-500 mb-3 italic">{frame.description}</p>
        
        <div className="mt-auto">
          <div className="flex items-baseline mb-4">
             <span className="text-xs text-slate-400 mr-1">Por apenas</span>
             <span className="text-2xl font-black text-orange-600">
              R$ {frame.price.toFixed(2).replace('.', ',')}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
             <button 
                onClick={() => onViewDetails(frame)}
                className="text-xs font-bold uppercase border-2 border-slate-200 text-slate-600 px-3 py-2 rounded-lg hover:border-blue-600 hover:text-blue-600 transition"
             >
                Detalhes
             </button>
             <button 
                onClick={() => onAddToBudget(frame)}
                className="text-xs font-bold uppercase bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-700 transition shadow-md flex justify-center items-center"
             >
                Orçar Agora
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;