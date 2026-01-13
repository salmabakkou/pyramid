"use client";

import { useState } from 'react'; 
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  ShoppingCart, 
  ChevronLeft,
  ChevronRight,
  Triangle,
  Menu
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navLinks = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Produits', href: '/products', icon: Package },
    { name: 'Ajouter', href: '/products/new', icon: PlusCircle },
  ];

  return (
    <>
      <aside 
        className={`h-screen bg-[#0f172a] text-slate-300 flex flex-col fixed left-0 top-0 border-r border-slate-800 transition-all duration-300 z-50
        ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        
        <div className={`p-6 mb-4 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="min-w-10 h-10 bg-[#14b8a6] rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Triangle className="text-white fill-white" size={22} />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-xl font-bold text-white leading-none">Pyramid</span>
            </div>
          )}
        </div>

        <nav className="flex-1 px-3 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                title={isCollapsed ? link.name : ""} 
                className={`flex items-center rounded-xl transition-all duration-200 group
                  ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3 gap-3'}
                  ${isActive 
                    ? 'bg-[#14b8a6] text-white shadow-lg shadow-teal-900/40' 
                    : 'hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <Icon size={22} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
                {!isCollapsed && <span className="font-medium whitespace-nowrap">{link.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center w-full h-12 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white"
          >
            {isCollapsed ? <ChevronRight size={24} /> : (
              <div className="flex items-center gap-3 w-full px-2">
                <ChevronLeft size={20} />
                <span className="text-sm font-medium">Réduire</span>
              </div>
            )}
          </button>
        </div>
      </aside>

      <style jsx global>{`
        main {
          margin-left: ${isCollapsed ? '80px' : '256px'};
          transition: margin-left 0.3s ease;
        }
        @media (max-width: 768px) {
          aside { width: ${isCollapsed ? '0px' : '64px'}; overflow: hidden; }
          main { margin-left: 0px !important; }
        }
      `}</style>
    </>
  );
}