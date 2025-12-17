import React, { useState, useMemo } from 'react';
import { FRAMES } from '../data';
import { Frame } from '../types';
import ProductCard from './ProductCard';
import ProductDetailsModal from './ProductDetailsModal';
import SidebarFilters from './SidebarFilters';

interface CatalogProps {
    onNavigateToBudget: (message: string) => void;
}

const Catalog: React.FC<CatalogProps> = ({ onNavigateToBudget }) => {
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
  
  // State for filters
  const [activeFilters, setActiveFilters] = useState<{
    usage: string[];
    gender: string[];
    shape: string[];
    material: string[];
    frameColor: string[];
    faceShape: string[];
    lensWidth: number[];
    bridgeSize: number[];
    templeLength: number[];
  }>({
    usage: [],
    gender: [],
    shape: [],
    material: [],
    frameColor: [],
    faceShape: [],
    lensWidth: [],
    bridgeSize: [],
    templeLength: []
  });

  // Extract available options dynamically from data
  const filterOptions = useMemo(() => {
    return {
      usage: FRAMES.map(f => f.usage),
      gender: FRAMES.map(f => f.gender),
      shape: FRAMES.map(f => f.shape),
      material: FRAMES.map(f => f.material),
      frameColor: FRAMES.map(f => f.frameColor),
      faceShape: FRAMES.map(f => f.faceShape),
      lensWidth: FRAMES.map(f => f.lensWidth),
      bridgeSize: FRAMES.map(f => f.bridgeSize),
      templeLength: FRAMES.map(f => f.templeLength),
    };
  }, []);

  const handleFilterChange = (category: string, value: string | number) => {
    setActiveFilters(prev => {
      const currentValues = prev[category as keyof typeof prev] as (string | number)[];
      const newValues = currentValues.includes(value as never)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return { ...prev, [category]: newValues };
    });
  };

  const handleClearFilters = () => {
    setActiveFilters({
      usage: [],
      gender: [],
      shape: [],
      material: [],
      frameColor: [],
      faceShape: [],
      lensWidth: [],
      bridgeSize: [],
      templeLength: []
    });
  };

  // Filter Logic
  const filteredFrames = useMemo(() => {
    return FRAMES.filter(frame => {
      if (activeFilters.usage.length > 0 && !activeFilters.usage.includes(frame.usage)) return false;
      if (activeFilters.gender.length > 0 && !activeFilters.gender.includes(frame.gender)) return false;
      if (activeFilters.shape.length > 0 && !activeFilters.shape.includes(frame.shape)) return false;
      if (activeFilters.material.length > 0 && !activeFilters.material.includes(frame.material)) return false;
      if (activeFilters.frameColor.length > 0 && !activeFilters.frameColor.includes(frame.frameColor)) return false;
      if (activeFilters.faceShape.length > 0 && !activeFilters.faceShape.includes(frame.faceShape)) return false;
      if (activeFilters.lensWidth.length > 0 && !activeFilters.lensWidth.includes(frame.lensWidth)) return false;
      if (activeFilters.bridgeSize.length > 0 && !activeFilters.bridgeSize.includes(frame.bridgeSize)) return false;
      if (activeFilters.templeLength.length > 0 && !activeFilters.templeLength.includes(frame.templeLength)) return false;
      return true;
    });
  }, [activeFilters]);

  const handleAddToBudget = (frame: Frame) => {
      setSelectedFrame(null);
      const message = `Gostaria de um orçamento para a armação "${frame.name}" (R$ ${frame.price.toFixed(2)}).`;
      onNavigateToBudget(message);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-sm border-l-4 border-orange-600">
          <div>
            <h2 className="text-2xl font-black text-blue-900 uppercase tracking-tight">Catálogo de Produtos</h2>
            <p className="text-sm text-slate-500">
              Mostrando {filteredFrames.length} resultado(s)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <SidebarFilters 
              filters={filterOptions}
              selectedFilters={activeFilters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {filteredFrames.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredFrames.map(frame => (
                  <ProductCard 
                    key={frame.id} 
                    frame={frame} 
                    onViewDetails={setSelectedFrame}
                    onAddToBudget={handleAddToBudget}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-slate-200">
                <div className="text-6xl mb-4">👓</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Nenhum produto encontrado</h3>
                <p className="text-slate-500 mb-6">Tente ajustar seus filtros para encontrar o que procura.</p>
                <button 
                  onClick={handleClearFilters}
                  className="bg-orange-600 text-white px-6 py-2 rounded-full font-bold hover:bg-orange-700 transition"
                >
                  Limpar Filtros
                </button>
              </div>
            )}
          </div>
        </div>

        {selectedFrame && (
          <ProductDetailsModal 
              frame={selectedFrame} 
              onClose={() => setSelectedFrame(null)}
              onAddToBudget={handleAddToBudget}
          />
        )}
      </div>
    </div>
  );
};

export default Catalog;