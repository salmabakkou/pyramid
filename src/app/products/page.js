"use client";

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { getProductsThunk, deleteProductThunk } from '@/store/productsSlice';
import { Plus, Search, SlidersHorizontal, Package, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductsPage() {
    const dispatch = useDispatch();

    const {items, loading} = useSelector((state)=>state.products);

    useEffect(()=>{
        dispatch(getProductsThunk());
     }, [dispatch])

    const [productToDelete, setProductToDelete]= useState(null);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 min-h-screen bg-slate-50/30">
      
      {/* 1. SECTION EN-TÊTE (Header) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Produits</h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">
            Gérez votre inventaire de produits
          </p>
        </div>
        
        <Link 
          href="/products/new" 
          className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20"
        >
          <Plus className="w-5 h-5 mr-2" />
          Ajouter un produit
        </Link>
      </div>

      {/* 2. SECTION BARRE DE FILTRES (Search & Selects) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        
        {/* Barre de recherche */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Rechercher un produit..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-teal-500/20 outline-none transition-all placeholder:text-slate-400"
          />
        </div>
        
        {/* Filtres Select */}
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <select className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-teal-500/20 outline-none appearance-none cursor-pointer text-slate-700 font-medium">
              <option>Toutes catégories</option>
              <option>Électronique</option>
              <option>Informatique</option>
            </select>
          </div>

          <div className="relative flex-1 md:w-48">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            </div>
            <select className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-teal-500/20 outline-none appearance-none cursor-pointer text-slate-700 font-medium">
              <option>Plus récent</option>
              <option>Prix croissant</option>
              <option>Prix décroissant</option>
              <option>Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. ZONE DE GRILLE (Emplacement des Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            
            {/* Si c'est en train de charger, on peut afficher un petit texte */}
            {loading && <p className="text-teal-600 font-bold">Chargement des produits...</p>}

            {/* On boucle sur "items" qui vient du store Redux */}
            {!loading && items.map((p) => (
                <ProductCard 
                  key={p.id} 
                  product={p}
                  onDeleteClick={() => setProductToDelete(p.id)}
                 />
            ))}

            {/* Si ce n'est pas en train de charger et qu'il n'y a aucun produit */}
            {!loading && items.length === 0 && (
                <div className="col-span-full text-center py-20">
                    <p className="text-slate-400 text-lg font-medium">Votre inventaire est vide.</p>
                </div>
            )}
        </div>
        {/* MODAL DE CONFIRMATION */}
        {productToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
              <div className="text-center">
                <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Êtes-vous sûr ?</h2>
                <p className="text-slate-500 mt-2">
                  Cette action est irréversible. Le produit sera définitivement supprimé.
                </p>
              </div>

              <div className="flex gap-3 mt-8">
                <button 
                  onClick={() => setProductToDelete(null)}
                  className="flex-1 py-3 px-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Annuler
                </button>
                <button 
                  onClick={async () => {
                    // 1. Créer le toast de chargement
                    const deleteToast = toast.loading("Suppression en cours...");
                    
                    try {
                      // 2. Lancer la suppression et attendre le résultat
                      await dispatch(deleteProductThunk(productToDelete)).unwrap();
                      
                      // 3. Succès : On remplace le chargement par un succès
                      toast.success("Produit supprimé !", { id: deleteToast });
                      
                      // Fermer la popup
                      setProductToDelete(null);
                    } catch (err) {
                      // 4. Erreur : On remplace le chargement par une erreur
                      toast.error("Échec de la suppression", { id: deleteToast });
                    }
                  }}
                  className="flex-1 py-3 px-4 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all"
                >
                Supprimer
              </button>
              </div>
            </div>
          </div>
        )}

    </div>
  );
}