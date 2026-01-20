"use client";

import { Trash2, Edit, Layers, Package, Eye } from 'lucide-react';
import Link from 'next/link';

export const ProductCard = ({ product, onDeleteClick, onEditClick }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
      
      {/*  Zone Image & Badge */}
      <div className="aspect-4/3 relative overflow-hidden bg-slate-100">
        <img 
          src={product?.image || "https://via.placeholder.com/400x300"} 
          alt={product?.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-700 shadow-sm flex items-center border border-slate-100">
            <Layers className="w-3 h-3 mr-1 text-teal-600" />
            {product?.category}
          </span>
        </div>
      </div>

      {/* Infos du produit */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 text-lg truncate">
            {product?.name}
          </h3>
          <div className="flex items-center text-teal-600 mt-1">
            <span className="text-xl font-black">{product?.price}</span>
            <span className="text-sm ml-0.5 font-bold">€</span>
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs font-semibold text-slate-500">
             <div className="flex items-center">
                <Package className={`w-3.5 h-3.5 mr-1 ${product?.quantity < 5 ? 'text-orange-500' : 'text-slate-400'}`} />
                <span>Stock: {product?.quantity}</span>
             </div>
          </div>
        </div>

        {/*  Barre d'actions (3 colonnes égales) */}
        <div className="grid grid-cols-3 gap-2 mt-5">
          
          {/* Bouton Détails (L'œil)  */}
          <Link 
            href={`/products/${product.id}`} 
            className="flex items-center justify-center py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all active:scale-95 shadow-sm"
          >
            <Eye className="w-4 h-4" />
          </Link>
          
          {/* Bouton Modifier */}
          <button 
            onClick={onEditClick} 
            className="flex items-center justify-center py-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-teal-50 hover:text-teal-600 transition-all active:scale-95 border border-slate-200/50"
          >
            <Edit className="w-4 h-4" />
          </button>

          {/* Bouton Supprimer */}
          <button 
            onClick={onDeleteClick} 
            className="flex items-center justify-center py-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-95 border border-red-100"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};