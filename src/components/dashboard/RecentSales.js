"use client";
import React, { useState, useMemo } from 'react';
import { Tag, ChevronDown, ShoppingBag } from 'lucide-react';

export const RecentSales = ({ allItems = [] }) => {
  const [category, setCategory] = useState('Tous');

  // LOGIQUE : Filtrage des produits "Vendus" & Filtrage par catégorie
  const filtered = useMemo(() => {
    let res = allItems.filter(p => p.status === 'Vendu');
    
    //  le filtre de catégorie 
    if (category !== 'Tous') {
      res = res.filter(p => p.category === category);
    }
    
    // Tri par date de vente décroissante (le plus récent en haut)
    return res.sort((a, b) => new Date(b.saleDate || 0) - new Date(a.saleDate || 0));
  }, [allItems, category]);

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
      {/* EN-TÊTE DU TABLEAU */}
      <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
        <div className="flex items-center gap-3">
          <div className="bg-teal-50 p-2 rounded-lg text-teal-600">
            <Tag size={20}/>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-xl">Historique des Ventes</h3>
            <p className="text-xs text-slate-400 font-medium">{filtered.length} ventes affichées</p>
          </div>
        </div>

        <div className="relative">
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="appearance-none bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-4 pr-10 text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
          >
            <option value="Tous">Toutes catégories</option>
            <option value="Électronique">Électronique</option>
            <option value="Informatique">Informatique</option>
            <option value="Accessoires">Accessoires</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* ZONE DU TABLEAU */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <tr>
              <th className="px-8 py-5">Produit</th>
              <th className="px-8 py-5 text-center">Catégorie</th>
              <th className="px-8 py-5 text-center">Prix</th>
              <th className="px-8 py-5 text-right">Date de Vente</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {filtered.length > 0 ? (
              filtered.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                        <img 
                          src={sale.image || "/api/placeholder/40/40"} 
                          className="w-full h-full object-cover" 
                          alt={sale.name} 
                        />
                      </div>
                      <span className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                        {sale.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-center">
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500">
                      {sale.category}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-center font-black text-slate-700">
                    {Number(sale.price).toLocaleString()} €
                  </td>
                  <td className="px-8 py-4 text-right">
                    <span className="font-bold text-slate-900">
                      {sale.saleDate ? new Date(sale.saleDate).toLocaleDateString('fr-FR') : 'NC'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-medium italic">
                  Aucune vente enregistrée dans cette catégorie.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};