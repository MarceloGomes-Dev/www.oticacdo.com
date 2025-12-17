import React from 'react';
import { X, Ruler, Weight, Palette, Box, User, Glasses } from 'lucide-react';
import { Frame } from '../types';

interface ProductDetailsModalProps {
  frame: Frame;
  onClose: () => void;
  onAddToBudget: (frame: Frame) => void;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ frame, onClose, onAddToBudget }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Background backdrop */}
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} aria-hidden="true"></div>

        {/* Modal panel */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          
          <div className="absolute top-0 right-0 pt-4 pr-4 z-10">
            <button
              type="button"
              className="bg-white/80 rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Fechar</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <div className="flex justify-between items-start">
                    <h3 className="text-2xl leading-6 font-bold text-gray-900 mb-2" id="modal-title">
                    {frame.name}
                    </h3>
                </div>
                
                <div className="flex gap-2 mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 uppercase">
                    {frame.usage}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800 uppercase">
                    {frame.gender}
                    </span>
                </div>

                <div className="mt-2 mb-6">
                   <img 
                    src={frame.imageUrl} 
                    alt={frame.name} 
                    className="w-full h-56 object-cover rounded-md mb-4 shadow-inner"
                  />
                  <p className="text-sm text-gray-500 mb-6 italic">
                    {frame.description}
                  </p>
                  
                  <h4 className="text-sm font-bold text-slate-900 uppercase mb-2">Especificações Técnicas</h4>
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <div className="flex items-center text-xs text-gray-700">
                        <Box className="h-3.5 w-3.5 mr-2 text-blue-500" />
                        <span className="font-semibold mr-1">Material:</span> {frame.material}
                    </div>
                    <div className="flex items-center text-xs text-gray-700">
                        <Palette className="h-3.5 w-3.5 mr-2 text-blue-500" />
                        <span className="font-semibold mr-1">Cor:</span> {frame.frameColor}
                    </div>
                     <div className="flex items-center text-xs text-gray-700">
                        <Glasses className="h-3.5 w-3.5 mr-2 text-blue-500" />
                        <span className="font-semibold mr-1">Formato:</span> {frame.shape}
                    </div>
                     <div className="flex items-center text-xs text-gray-700">
                        <User className="h-3.5 w-3.5 mr-2 text-blue-500" />
                        <span className="font-semibold mr-1">Rosto Ideal:</span> {frame.faceShape}
                    </div>
                    <div className="flex items-center text-xs text-gray-700 col-span-2">
                        <Ruler className="h-3.5 w-3.5 mr-2 text-blue-500" />
                        <span className="font-semibold mr-1">Medidas:</span> {frame.lensWidth}-{frame.bridgeSize}-{frame.templeLength}
                    </div>
                     <div className="flex items-center text-xs text-gray-700">
                        <Weight className="h-3.5 w-3.5 mr-2 text-blue-500" />
                        <span className="font-semibold mr-1">Peso:</span> {frame.weight}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <div>
                        <span className="text-xs text-slate-400 block">Preço à vista</span>
                        <span className="text-3xl font-black text-orange-600">
                            R$ {frame.price.toFixed(2).replace('.', ',')}
                        </span>
                    </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-3 bg-blue-900 text-base font-bold uppercase text-white hover:bg-orange-600 transition focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => onAddToBudget(frame)}
            >
              Simular Orçamento
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-3 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;