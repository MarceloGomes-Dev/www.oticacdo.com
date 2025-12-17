import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroCarouselProps {
  onBannerClick: () => void;
}

const BANNERS = [
  {
    id: 1,
    // Desktop: 16:9 Aspect Ratio - 2560x1440 (2K) for extreme sharpness
    desktopImage: "https://images.unsplash.com/photo-1577803645773-f96470509666?ixlib=rb-1.2.1&auto=format&fit=crop&w=2560&h=1440&q=100",
    // Mobile: 9:16 Aspect Ratio - 1080x1920 (Full HD Vertical)
    mobileImage: "https://images.unsplash.com/photo-1577803645773-f96470509666?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&h=1920&q=100",
    title: "VERÃO CDO",
    subtitle: "Ganhe 5% OFF pagando no PIX",
    description: "Uma seleção de óculos de sol pensada para quem vive o verão intensamente.",
    color: "bg-yellow-400",
    textColor: "text-blue-900"
  },
  {
    id: 2,
    // Desktop: 16:9
    desktopImage: "https://images.unsplash.com/photo-1570222094114-28a9d88a2b64?ixlib=rb-1.2.1&auto=format&fit=crop&w=2560&h=1440&q=100",
    // Mobile: 9:16
    mobileImage: "https://images.unsplash.com/photo-1570222094114-28a9d88a2b64?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&h=1920&q=100",
    title: "NOVOS ESTILOS",
    subtitle: "Coleção Masculina",
    description: "Design moderno e materiais premium para o seu dia a dia.",
    color: "bg-blue-600",
    textColor: "text-white"
  },
  {
    id: 3,
    // Desktop: 16:9
    desktopImage: "https://images.unsplash.com/photo-1596464716127-f9a87595ca05?ixlib=rb-1.2.1&auto=format&fit=crop&w=2560&h=1440&q=100",
    // Mobile: 9:16
    mobileImage: "https://images.unsplash.com/photo-1596464716127-f9a87595ca05?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&h=1920&q=100",
    title: "VOLTA ÀS AULAS",
    subtitle: "Linha Infantil Flex",
    description: "Resistência e conforto para os pequenos aprenderem brincando.",
    color: "bg-orange-500",
    textColor: "text-white"
  }
];

const HeroCarousel: React.FC<HeroCarouselProps> = ({ onBannerClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % BANNERS.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-full w-full cursor-pointer group" onClick={onBannerClick}>
      {BANNERS.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Responsive Background Image using Picture tag for Art Direction */}
          <picture>
            {/* Mobile Source (9:16) */}
            <source media="(max-width: 768px)" srcSet={banner.mobileImage} />
            {/* Desktop Source (16:9) */}
            <source media="(min-width: 769px)" srcSet={banner.desktopImage} />
            {/* Main Image */}
            <img
              src={banner.desktopImage}
              alt={banner.title}
              className="w-full h-full object-cover"
              // Ensure the image covers the container perfectly
            />
          </picture>
          
          {/* Overlay Gradient - Darker at bottom for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-transparent"></div>

          {/* Banner Content */}
          <div className="absolute inset-0 flex items-center justify-center md:justify-start">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-xl text-center md:text-left pt-32 md:pt-0"> {/* Added padding top for mobile vertical alignment */}
                 {/* Badge */}
                 <div className={`inline-block px-4 py-1 mb-4 md:mb-6 text-xs md:text-sm font-black tracking-widest uppercase rounded-full shadow-lg transform -rotate-2 ${banner.color} ${banner.textColor}`}>
                    {banner.subtitle}
                 </div>
                 
                 {/* Title */}
                 <h2 className="text-4xl md:text-7xl font-black text-white mb-4 leading-tight drop-shadow-2xl font-sans italic">
                    {banner.title.split(' ').map((word, i) => (
                        <span key={i} className={i % 2 !== 0 ? 'text-orange-400' : 'text-white'}>{word} </span>
                    ))}
                 </h2>
                 
                 {/* Description */}
                 <p className="text-sm md:text-xl text-blue-50 mb-8 font-medium drop-shadow-md max-w-md mx-auto md:mx-0 leading-relaxed">
                    {banner.description}
                 </p>
                 
                 {/* CTA Button */}
                 <div className="inline-flex items-center px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-full font-bold text-lg transition-all transform group-hover:scale-105 shadow-xl border-4 border-white/20">
                    VER MODELOS
                    <ArrowRight className="ml-2 h-6 w-6" />
                 </div>
              </div>
            </div>
          </div>

          {/* Discount Circle (Desktop Only) */}
          {index === 0 && (
             <div className="hidden md:flex absolute top-20 right-20 bg-red-600 text-white rounded-full h-40 w-40 flex-col items-center justify-center p-4 transform rotate-12 shadow-2xl border-4 border-dashed border-white animate-pulse">
                <span className="text-sm font-bold uppercase">Ganhe</span>
                <span className="text-5xl font-black">5%</span>
                <span className="text-xs text-center font-bold">de desconto no PIX</span>
             </div>
          )}
        </div>
      ))}

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
        {BANNERS.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
            }}
            className={`h-2 rounded-full transition-all duration-300 shadow-sm ${
              index === currentIndex ? 'bg-orange-500 w-12' : 'bg-white/50 w-3 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;