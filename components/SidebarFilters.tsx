import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';

interface FilterOptions {
  gender: string[];
  usage: string[];
  shape: string[];
  material: string[];
  frameColor: string[];
  faceShape: string[];
  lensWidth: number[];
  bridgeSize: number[];
  templeLength: number[];
}

interface SidebarFiltersProps {
  filters: FilterOptions;
  selectedFilters: any;
  onFilterChange: (category: string, value: string | number) => void;
  onClearFilters: () => void;
}

const FilterSection: React.FC<{ 
  title: string; 
  options: (string | number)[]; 
  category: string;
  selectedValues: (string | number)[];
  onChange: (category: string, value: string | number) => void;
  defaultOpen?: boolean;
}> = ({ title, options, category, selectedValues, onChange, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Remove duplicates and sort
  const uniqueOptions = Array.from(new Set(options)).sort((a, b) => {
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    return String(a).localeCompare(String(b));
  });

  return (
    <div className="border-b border-slate-200 py-4">
      <button 
        className="flex items-center justify-between w-full text-left font-bold text-slate-800 hover:text-orange-600 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="uppercase text-xs tracking-wider">{title}</span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      
      {isOpen && (
        <div className="mt-3 space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
          {uniqueOptions.map((opt) => (
            <label key={opt} className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  className="peer h-4 w-4 border-2 border-slate-300 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                  checked={selectedValues.includes(opt)}
                  onChange={() => onChange(category, opt)}
                />
              </div>
              <span className={`text-sm group-hover:text-orange-600 transition-colors ${
                selectedValues.includes(opt) ? 'font-bold text-slate-900' : 'text-slate-600'
              }`}>
                {opt}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const SidebarFilters: React.FC<SidebarFiltersProps> = ({ filters, selectedFilters, onFilterChange, onClearFilters }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="md:hidden w-full mb-4 flex items-center justify-center bg-blue-900 text-white p-3 rounded-lg font-bold shadow-md"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <Filter className="h-5 w-5 mr-2" />
        {isMobileOpen ? 'Fechar Filtros' : 'Filtrar Produtos'}
      </button>

      {/* Sidebar Container */}
      <div className={`
        bg-white rounded-lg shadow-sm border border-slate-100 p-5
        md:block ${isMobileOpen ? 'block' : 'hidden'}
      `}>
        <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
          <h3 className="font-black text-lg text-blue-900 uppercase">Filtros</h3>
          <button 
            onClick={onClearFilters}
            className="text-xs text-orange-600 hover:text-orange-800 font-bold uppercase underline"
          >
            Limpar
          </button>
        </div>

        <FilterSection 
          title="Departamento / Categoria" 
          category="usage" 
          options={filters.usage} 
          selectedValues={selectedFilters.usage} 
          onChange={onFilterChange}
          defaultOpen={true}
        />
        
        <FilterSection 
          title="Gênero" 
          category="gender" 
          options={filters.gender} 
          selectedValues={selectedFilters.gender} 
          onChange={onFilterChange}
          defaultOpen={true}
        />

        <FilterSection 
          title="Cor da Armação" 
          category="frameColor" 
          options={filters.frameColor} 
          selectedValues={selectedFilters.frameColor} 
          onChange={onFilterChange}
          defaultOpen={true}
        />

        <FilterSection 
          title="Formato" 
          category="shape" 
          options={filters.shape} 
          selectedValues={selectedFilters.shape} 
          onChange={onFilterChange}
        />

        <FilterSection 
          title="Formato do Rosto" 
          category="faceShape" 
          options={filters.faceShape} 
          selectedValues={selectedFilters.faceShape} 
          onChange={onFilterChange}
        />

        <FilterSection 
          title="Material" 
          category="material" 
          options={filters.material} 
          selectedValues={selectedFilters.material} 
          onChange={onFilterChange}
        />

        <FilterSection 
          title="Largura da Lente" 
          category="lensWidth" 
          options={filters.lensWidth} 
          selectedValues={selectedFilters.lensWidth} 
          onChange={onFilterChange}
        />

        <FilterSection 
          title="Tamanho da Ponte" 
          category="bridgeSize" 
          options={filters.bridgeSize} 
          selectedValues={selectedFilters.bridgeSize} 
          onChange={onFilterChange}
        />

        <FilterSection 
          title="Comprimento da Haste" 
          category="templeLength" 
          options={filters.templeLength} 
          selectedValues={selectedFilters.templeLength} 
          onChange={onFilterChange}
        />

      </div>
    </>
  );
};

export default SidebarFilters;