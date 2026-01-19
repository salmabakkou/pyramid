"use client";

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { getProductsThunk, deleteProductThunk, updateProductThunk } from '@/store/productsSlice';
import { Plus, Search, SlidersHorizontal, Trash2, X, Edit, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductsPage() {
    const dispatch = useDispatch();
    const { items, loading } = useSelector((state) => state.products);

    // États locaux
    const [productToDelete, setProductToDelete] = useState(null);
    const [productToEdit, setProductToEdit] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    // États de filtrage
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Toutes catégories");
    const [sortBy, setSortBy] = useState("Plus récent");

    const filtredItems = items
     .filter((product)=>{
       const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
       const matchesCategories = selectedCategory === "Toutes catégories" || product.category === selectedCategory ;
       return matchesSearch && matchesCategories ;
     })
     .sort((a, b)=>{
      if(sortBy === "Prix croissant") return a.price - b.price ;
      if(sortBy === "Prix décroissant") return b.price - a.price ;
      if(sortBy === "Stock") return b.quantity - a.quantity ;
      return b.id - a.id
     })

    useEffect(() => {
        dispatch(getProductsThunk());
    }, [dispatch]);

    // Gérer l'aperçu de l'image
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const temporaryUrl = URL.createObjectURL(file);
            setPreviewImage(temporaryUrl);
        }
    };

    // Soumission de la modification
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const formDataRaw = new FormData(e.target);
        const data = Object.fromEntries(formDataRaw.entries());

        const imageInput = e.target.elements.image;
        const imageFile = imageInput?.files?.[0] || null;

        const loadToast = toast.loading("Mise à jour du produit...");

        try {
            const productData = {
                ...data,
                price: Number(data.price),
                quantity: Number(data.quantity),
                image: imageFile || productToEdit.image 
            };

            await dispatch(updateProductThunk({ 
                id: productToEdit.id, 
                productData 
            })).unwrap();

            toast.success("Produit mis à jour !", { id: loadToast });
            
            // On ferme et on nettoie tout
            setProductToEdit(null);
            setPreviewImage(null);
        } catch (err) {
            toast.error("Échec de la mise à jour", { id: loadToast });
        }
    };

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
            value={searchTerm}
            onChange={(e)=>setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-teal-500/20 outline-none transition-all placeholder:text-slate-400"
          />
        </div>
        
        {/* Filtres Select */}
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <select 
              value={selectedCategory}
              onChange={(e)=>setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-teal-500/20 outline-none appearance-none cursor-pointer text-slate-700 font-medium">
              <option>Toutes catégories</option>
              <option>Électronique</option>
              <option>Informatique</option>
            </select>
          </div>

          <div className="relative flex-1 md:w-48">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            </div>
            <select
              value={sortBy}
              onChange={(e)=>setSortBy(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-teal-500/20 outline-none appearance-none cursor-pointer text-slate-700 font-medium">
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
            {loading && <p>Chargement...</p>}
            {filtredItems.map((p) => (
                <ProductCard 
                    key={p.id} 
                    product={p}
                    onDeleteClick={() => setProductToDelete(p.id)}
                    onEditClick={() => {
                        setProductToEdit(p);
                        setPreviewImage(null); // Reset preview à l'ouverture
                    }}
                />
            ))}
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
        {/* MODAL DE MODIFICATION */}
        {productToEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl border border-slate-100 my-8 animate-in zoom-in duration-200">
              
              {/* Header Modal */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Edit className="w-6 h-6 text-teal-600" /> Modifier le produit
                </h2>
                <button onClick={() => setProductToEdit(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleUpdateSubmit} className="space-y-5">
                  {/* Nom du produit */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Nom du produit</label>
                    <input 
                      name="name"
                      type="text"
                      defaultValue={productToEdit.name}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                      required
                    />
                  </div>

                  {/* Quantité et Prix */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Quantité</label>
                      <input 
                        name="quantity" 
                        type="number" 
                        defaultValue={productToEdit.quantity} 
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-teal-500/20" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Prix (€)</label>
                      <input 
                        name="price" 
                        type="number" 
                        defaultValue={productToEdit.price} 
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-teal-500/20" 
                        required 
                      />
                    </div>
                  </div>

                  {/* Catégorie */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Catégorie</label>
                    <select 
                      name="category" 
                      defaultValue={productToEdit.category} 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-teal-500/20"
                    >
                      <option>Électronique</option>
                      <option>Informatique</option>
                      <option>Accessoires</option>
                    </select>
                  </div>

                  {/* ZONE IMAGE (Le fix pour ton erreur est ici) */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Image du produit</label>
                    <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl bg-slate-50/50">
                        {/* Image actuelle */}
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white shadow-md flex-shrink-0">
                            <img 
                                src={previewImage || productToEdit.image}
                                alt="Preview" 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                        
                        {/* Input pour la nouvelle image */}
                        <label className="flex-1 flex flex-col items-center justify-center py-4 border-2 border-dashed border-slate-200 rounded-xl hover:border-teal-400 hover:bg-white cursor-pointer transition-all group">
                            <input 
                                name="image" 
                                type="file" 
                                className="hidden" 
                                accept="image/*" 
                                onChange={handleImageChange}
                            />
                            <Upload className="w-5 h-5 text-teal-600 mb-1 group-hover:scale-110 transition-transform" />
                            <span className="text-xs text-slate-500 font-medium">Changer la photo</span>
                        </label>
                    </div>
                  </div>

                  {/* Boutons d'action */}
                  <div className="pt-4 flex flex-col md:flex-row gap-3">
                    <button 
                      type="button"
                      onClick={() => setProductToEdit(null)}
                      className="flex-1 py-3 px-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                    >
                      Annuler
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-3 px-4 bg-teal-600 text-white rounded-xl font-bold shadow-lg shadow-teal-600/20 hover:bg-teal-700 transition-all"
                    >
                      Enregistrer les modifications
                    </button>
                  </div>
              </form>
            </div>
          </div>
        )}

    </div>
  );
}