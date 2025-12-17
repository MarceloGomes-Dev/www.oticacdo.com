import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react'; // Import icon
import Navbar from './components/Navbar';
import Catalog from './components/Catalog';
import LensTable from './components/LensTable';
import AIOptician from './components/AIOptician';
import Footer from './components/Footer';
import HeroCarousel from './components/HeroCarousel';

function App() {
  const [currentSection, setCurrentSection] = useState('hero');
  const [budgetRequest, setBudgetRequest] = useState('');

  const handleNavigateToBudget = (message: string) => {
      setBudgetRequest(message);
      setCurrentSection('budget');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBannerClick = () => {
    setCurrentSection('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'catalog':
        return <Catalog onNavigateToBudget={handleNavigateToBudget} />;
      case 'lenses':
        return <LensTable onNavigateToBudget={handleNavigateToBudget} />;
      case 'budget':
        return (
          <div className="bg-slate-50 min-h-screen">
            <div className="bg-blue-900 py-12 mb-8 text-center text-white">
               <h2 className="text-3xl font-extrabold uppercase tracking-wide">
                  Consultor Virtual
                </h2>
                <p className="mt-2 text-blue-200 max-w-2xl mx-auto px-4">
                  Descreva o que precisa e receba uma recomendação completa com orçamento.
                </p>
            </div>
            <AIOptician initialMessage={budgetRequest} />
          </div>
        );
      case 'hero':
      default:
        return (
          <div>
            {/* Hero Section with Adaptive Aspect Ratio */}
            {/* 
                Mobile: aspect-[9/16] -> Tall vertical rectangle (shows full portrait image)
                Desktop: aspect-[16/9] -> Wide cinema rectangle (shows full landscape image)
            */}
            <div className="relative w-full aspect-[9/16] md:aspect-[16/9] bg-slate-900 flex items-center overflow-hidden shadow-2xl">
                <HeroCarousel onBannerClick={handleBannerClick} />
            </div>

            {/* Featured Section Preview */}
            <div className="py-16 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center mb-12">
                  <h2 className="text-base text-orange-600 font-bold tracking-wide uppercase">Destaques</h2>
                  <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-blue-900 sm:text-4xl">
                    Por que escolher a CDO?
                  </p>
                </div>
                <div className="mt-10">
                  <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Feature 1 */}
                    <div className="flex flex-col items-center text-center group">
                      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="mt-5 text-lg leading-6 font-bold text-slate-900">Qualidade Garantida</h3>
                      <p className="mt-2 text-base text-slate-500">
                        Trabalhamos apenas com materiais duráveis e lentes certificadas com garantia.
                      </p>
                    </div>
                    
                    {/* Feature 2 */}
                    <div className="flex flex-col items-center text-center group">
                      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="mt-5 text-lg leading-6 font-bold text-slate-900">Melhor Custo-Benefício</h3>
                      <p className="mt-2 text-base text-slate-500">
                        Por sermos uma ótica online, oferecemos preços mais competitivos que lojas físicas.
                      </p>
                    </div>

                    {/* Feature 3 - Updated */}
                    <div className="flex flex-col items-center text-center group">
                      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                         {/* Home/Truck Icon SVG */}
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                      <h3 className="mt-5 text-lg leading-6 font-bold text-slate-900">Atendimento à Domicílio</h3>
                      <p className="mt-2 text-base text-slate-500">
                        Levamos a ótica até você! Experimente armações e receba seus óculos prontos no conforto do lar.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative font-sans">
      <Navbar onNavigate={setCurrentSection} />
      <div className="flex-grow">
        {renderSection()}
      </div>
      <Footer />
      
      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/5585999999999?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20com%20um%20consultor%20da%20%C3%93tica%20CDO."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 z-50 flex items-center gap-2 group border-4 border-white"
      >
        <MessageCircle className="h-8 w-8" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap text-sm font-bold">
          Falar com Consultor
        </span>
      </a>
    </div>
  );
}

export default App;