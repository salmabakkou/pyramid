"use client";

import { Trash2, Edit, Layers, Package, Eye, CheckCircle2, Calendar } from 'lucide-react';
import Link from 'next/link';

export const ProductCard = ({ product, onDeleteClick, onEditClick }) => {
  const isSold = product?.status === "Vendu";

  return (
    <div className={`group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full relative ${isSold ? 'opacity-80' : ''}`}>
      
      {/* Zone Image & Badges */}
      <div className="aspect-[4/3] relative overflow-hidden bg-slate-100">
        <img 
          src={product?.image || "https://via.placeholder.com/400x300"} 
          alt={product?.name} 
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isSold ? 'grayscale-[0.4]' : ''}`}
        />
        
        {/* Badge Catégorie */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-700 shadow-sm flex items-center border border-white/50">
            <Layers className="w-3 h-3 mr-1 text-teal-600" />
            {product?.category}
          </span>
        </div>

        {/* Étiquette VENDU */}
        {isSold && (
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] flex items-center justify-center">
            <div className="bg-white/95 px-4 py-2 rounded-2xl shadow-2xl border border-red-100 flex flex-col items-center transform -rotate-3 scale-110">
              <span className="text-red-600 font-black text-xs uppercase tracking-widest">Vendu</span>
              {product?.saleDate && (
                <span className="text-[8px] text-slate-500 font-bold mt-0.5">
                  {new Date(product.saleDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Infos du produit */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-slate-900 text-lg truncate flex-1">
              {product?.name}
            </h3>
            {isSold && <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-2 flex-shrink-0" />}
          </div>

          <div className="flex items-center text-teal-600">
            <span className="text-xl font-black">{product?.price}</span>
            <span className="text-sm ml-0.5 font-bold">€</span>
          </div>

          <div className="flex items-center gap-4 mt-3 text-xs font-semibold">
            {isSold ? (
              <div className="flex items-center text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                <span>Vendu le {new Date(product.saleDate).toLocaleDateString()}</span>
              </div>
            ) : (
              <div className={`flex items-center px-2 py-1 rounded-lg ${product?.quantity < 5 ? 'bg-orange-50 text-orange-600' : 'bg-slate-50 text-slate-500'}`}>
                <Package className="w-3.5 h-3.5 mr-1.5" />
                <span>Stock: {product?.quantity}</span>
              </div>
            )}
          </div>
        </div>

        {/* Barre d'actions */}
        <div className="grid grid-cols-3 gap-2 mt-5">
          <Link 
            href={`/products/${product.id}`} 
            className="flex items-center justify-center py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all active:scale-95 shadow-sm"
          >
            <Eye className="w-4 h-4" />
          </Link>
          
          <button 
            onClick={onEditClick} 
            className="flex items-center cursor-pointer justify-center py-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-teal-50 hover:text-teal-600 transition-all active:scale-95 border border-slate-200/50"
          >
            <Edit className="w-4 h-4" />
          </button>

          <button 
            onClick={onDeleteClick} 
            className="flex items-center cursor-pointer justify-center py-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-95 border border-red-100"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};