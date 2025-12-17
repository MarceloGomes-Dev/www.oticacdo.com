import React from 'react';
import { Phone, MapPin, Mail, Instagram, Facebook, MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-950 text-slate-300 py-12 mt-12 border-t-8 border-orange-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        <div>
          <div className="mb-6">
            <img 
              src="https://github.com/MarceloGomes-Dev/oticaCDO/blob/main/Logo.png?raw=true" 
              alt="Cia dos Óculos" 
              className="h-20 w-auto object-contain"
            />
          </div>
          <p className="text-sm leading-relaxed mb-4 text-blue-200">
            Sua ótica 100% online com atendimento à domicílio. 
            Levamos a experiência da ótica até o conforto da sua casa com tecnologia e humanização.
          </p>
        </div>

        <div>
          <h3 className="text-white text-xl font-extrabold mb-6 uppercase tracking-wider">Contato</h3>
          <ul className="space-y-4 text-sm">
            <li>
              <a 
                href="https://wa.me/5585999999999" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center hover:text-orange-400 transition group"
              >
                <div className="bg-blue-900 p-2 rounded-full mr-3 group-hover:bg-white group-hover:text-green-600 transition">
                     <MessageCircle className="h-4 w-4" /> 
                </div>
                <span className="font-bold">(85) 99999-9999 (WhatsApp)</span>
              </a>
            </li>
            <li className="flex items-center group cursor-default hover:text-orange-400 transition">
                <div className="bg-blue-900 p-2 rounded-full mr-3">
                    <Mail className="h-4 w-4" /> 
                </div>
                contato@oticacdo.com.br
            </li>
            <li className="flex items-center group cursor-default hover:text-orange-400 transition">
                <div className="bg-blue-900 p-2 rounded-full mr-3">
                    <MapPin className="h-4 w-4" /> 
                </div>
                Atendimento em Fortaleza e Caucaia
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white text-xl font-extrabold mb-6 uppercase tracking-wider">Redes Sociais</h3>
          <div className="flex flex-col space-y-4">
            <a 
              href="https://instagram.com/oticacdo_fortaleza" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center hover:text-orange-400 transition group"
            >
              <div className="bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 p-2 rounded-full mr-3 group-hover:scale-110 transition">
                <Instagram className="h-5 w-5 text-white" />
              </div>
              <span className="font-medium">@oticacdo_fortaleza</span>
            </a>
            
            <a 
              href="https://instagram.com/oticacdo_caucaia" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center hover:text-orange-400 transition group"
            >
               <div className="bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 p-2 rounded-full mr-3 group-hover:scale-110 transition">
                <Instagram className="h-5 w-5 text-white" />
              </div>
              <span className="font-medium">@oticacdo_caucaia</span>
            </a>
          </div>
          <p className="mt-8 text-xs text-slate-500">© 2024 Ótica CDO. Todos os direitos reservados.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;