import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onNavigate: (section: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNav = (section: string) => {
    onNavigate(section);
    setIsOpen(false);
  };

  return (
    <nav className="bg-blue-900 text-white sticky top-0 z-50 shadow-xl border-b-4 border-orange-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center cursor-pointer group" onClick={() => handleNav('hero')}>
            <img 
              src="https://github.com/MarceloGomes-Dev/oticaCDO/blob/main/Logo.png?raw=true" 
              alt="Logo Ótica CDO" 
              className="h-14 w-auto mr-4 object-contain hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tighter leading-none">ÓTICA <span className="text-orange-400">CDO</span></span>
              <span className="text-[10px] uppercase tracking-widest text-blue-200">Sua ótica em casa</span>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              <button onClick={() => handleNav('catalog')} className="hover:text-orange-400 font-semibold transition uppercase text-sm tracking-wide">Catálogo</button>
              <button onClick={() => handleNav('lenses')} className="hover:text-orange-400 font-semibold transition uppercase text-sm tracking-wide">Lentes</button>
              <button onClick={() => handleNav('budget')} className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-full font-bold transition shadow-lg transform hover:-translate-y-0.5 uppercase text-sm tracking-wide">
                Orçamento IA
              </button>
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-900 border-t border-blue-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button onClick={() => handleNav('catalog')} className="block w-full text-left hover:bg-blue-800 px-3 py-3 rounded-md text-base font-medium border-b border-blue-800">Catálogo</button>
            <button onClick={() => handleNav('lenses')} className="block w-full text-left hover:bg-blue-800 px-3 py-3 rounded-md text-base font-medium border-b border-blue-800">Lentes</button>
            <button onClick={() => handleNav('budget')} className="block w-full text-left text-orange-400 font-bold hover:bg-blue-800 px-3 py-3 rounded-md text-base">ORÇAMENTO IA</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;