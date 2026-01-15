"use client";

import { useState } from 'react'; 
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  ChevronLeft,
  ChevronRight,
  Triangle,
  Menu,
  X 
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const navLinks = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Produits', href: '/products', icon: Package },
    { name: 'Ajouter', href: '/products/new', icon: PlusCircle },
  ];

  return (
    <>
      {!isOpenMobile && (
        <button 
          className="fixed top-5 left-5 z-40 p-2 bg-[#14b8a6] text-white rounded-lg md:hidden shadow-lg"
          onClick={() => setIsOpenMobile(true)}
        >
          <Menu size={24} />
        </button>
      )}

      <aside 
        className={`fixed left-0 top-0 h-screen bg-[#0f172a] text-slate-300 flex flex-col border-r border-slate-800 transition-all duration-300 z-50
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 ${isCollapsed ? 'md:w-20' : 'md:w-64'} w-72`}
      >
        
        <div className="p-6 mb-4 flex items-center justify-between">
          <Link 
            href="/" 
            onClick={() => setIsOpenMobile(false)}
            className="flex items-center gap-3 group"
          >
            <div className="min-w-10 h-10 bg-[#14b8a6] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Triangle className="text-white fill-white" size={20} />
            </div>
            {!isCollapsed && (
              <span className="text-xl font-bold text-white tracking-tight">Pyramid</span>
            )}
          </Link>

          <button 
            className="md:hidden p-1 text-slate-400 hover:text-white"
            onClick={() => setIsOpenMobile(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpenMobile(false)}
                className={`flex items-center rounded-xl transition-all duration-200 
                  ${isCollapsed ? 'md:justify-center p-3' : 'px-4 py-3 gap-3'}
                  ${isActive ? 'bg-[#14b8a6] text-white shadow-md' : 'hover:bg-slate-800'}`}
              >
                <Icon size={22} />
                {!isCollapsed && <span className="font-medium">{link.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block p-3 border-t border-slate-800">
        <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`flex items-center w-full h-12 hover:bg-slate-800 rounded-xl text-slate-400 transition-all duration-200
            ${isCollapsed ? 'justify-center' : 'px-4 gap-3'}`} 
        >
            {isCollapsed ? (
            <ChevronRight size={24} />
            ) : (
            <>
                <ChevronLeft size={20} />
                <span className="font-medium">Réduire</span>
            </>
            )}
        </button>
        </div>
      </aside>

      {isOpenMobile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsOpenMobile(false)} />
      )}
    </>
  );
}