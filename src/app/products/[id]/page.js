"use client";

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { 
  getProductsThunk, 
  deleteProductThunk, 
  updateProductThunk 
} from '@/store/productsSlice';
import { 
  ArrowLeft, Trash2, X, Edit, Upload, 
  Package, Tag, Euro, AlertTriangle 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductDetailsAdmin() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  // Sélecteurs Redux
  const { items, loading } = useSelector((state) => state.products);
  const product = items.find((p) => p.id === id);

  // États pour les Modales (Popups)
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Charger les produits si la liste est vide (en cas de rafraîchissement de page)
  useEffect(() => {
    if (items.length === 0) {
      dispatch(getProductsThunk());
    }
  }, [dispatch, items.length]);

  // Gérer l'aperçu de l'image pour la modification
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const temporaryUrl = URL.createObjectURL(file);
      setPreviewImage(temporaryUrl);
    }
  };

  // Soumission de la modification (Même logique que ta page Products)
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
      setProductToEdit(null);
      setPreviewImage(null);
    } catch (err) {
      toast.error("Échec de la mise à jour", { id: loadToast });
    }
  };

  // Si le produit n'est pas trouvé
  if (!product && !loading) {
    return (
      <div className="p-10 text-center">
        <p className="text-slate-500">Produit introuvable...</p>
        <button onClick={() => router.push('/products')} className="text-teal-600 underline mt-2">
          Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 min-h-screen bg-slate-50/30">
      
      {/* BOUTON RETOUR */}
      <button 
        onClick={() => router.push('/products')}
        className="flex items-center text-slate-600 hover:text-black transition-colors font-semibold"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Retour à l'inventaire
      </button>

      {/* CARTE DE DÉTAILS PRINCIPALE */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="flex flex-col lg:flex-row">
          
          {/* Section Image */}
          <div className="lg:w-2/5 bg-slate-50 p-12 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-200">
            <img 
              src={product?.image} 
              alt={product?.name}
              className="max-h-96 w-full object-contain hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Section Informations */}
          <div className="lg:w-3/5 p-10 md:p-16 space-y-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-1.5 bg-teal-50 text-teal-600 rounded-full text-xs font-bold uppercase tracking-widest border border-teal-100">
                  {product?.category}
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-sm font-mono text-slate-400">REF: {product?.id}</span>
              </div>
              <h1 className="text-5xl font-black text-slate-900 leading-tight">{product?.name}</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-2">
                <p className="flex items-center text-slate-400 font-bold text-xs uppercase tracking-widest">
                  <Euro className="w-4 h-4 mr-2 text-teal-500" /> Prix de vente
                </p>
                <p className="text-4xl font-black text-slate-900">{product?.price} <span className="text-teal-600">€</span></p>
              </div>

              <div className="space-y-2">
                <p className="flex items-center text-slate-400 font-bold text-xs uppercase tracking-widest">
                  <Package className="w-4 h-4 mr-2 text-teal-500" /> Stock Disponible
                </p>
                <p className={`text-4xl font-black ${product?.quantity < 5 ? 'text-orange-500' : 'text-slate-900'}`}>
                  {product?.quantity} <span className="text-sm font-bold text-slate-400 uppercase">Unités</span>
                </p>
              </div>
            </div>

            {/* BARRE D'ACTIONS */}
            <div className="pt-10 border-t border-slate-100 flex flex-wrap gap-4">
              <button 
                onClick={() => {
                    setProductToEdit(product);
                    setPreviewImage(null);
                }}
                className="flex-1 min-w-[200px] inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95 gap-2"
              >
                <Edit className="w-5 h-5" />
                Modifier la fiche
              </button>
              
              <button 
                onClick={() => setProductToDelete(product.id)}
                className="inline-flex items-center justify-center px-8 py-4 bg-red-50 text-red-500 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all border border-red-100 active:scale-95 gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODALE DE CONFIRMATION DELETE  */}
      {productToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200 text-center">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Êtes-vous sûr ?</h2>
            <p className="text-slate-500 mt-2 leading-relaxed">
              Cette action est irréversible. Le produit sera définitivement supprimé de l'inventaire.
            </p>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setProductToDelete(null)} className="flex-1 py-3 px-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                Annuler
              </button>
              <button 
                onClick={async () => {
                  const deleteToast = toast.loading("Suppression en cours...");
                  try {
                    await dispatch(deleteProductThunk(productToDelete)).unwrap();
                    toast.success("Produit supprimé !", { id: deleteToast });
                    router.push("/products");
                  } catch (err) {
                    toast.error("Échec de la suppression", { id: deleteToast });
                    setProductToDelete(null);
                  }
                }}
                className="flex-1 py-3 px-4 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE DE MODIFICATION  */}
      {productToEdit && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl border border-slate-100 my-8 animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Edit className="w-6 h-6 text-teal-600" /> Modifier le produit
              </h2>
              <button onClick={() => setProductToEdit(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Nom du produit</label>
                <input name="name" type="text" defaultValue={productToEdit.name} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 outline-none" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Quantité</label>
                  <input name="quantity" type="number" defaultValue={productToEdit.quantity} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Prix (€)</label>
                  <input name="price" type="number" defaultValue={productToEdit.price} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Catégorie</label>
                <select name="category" defaultValue={productToEdit.category} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none">
                  <option>Électronique</option>
                  <option>Informatique</option>
                  <option>Accessoires</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Image du produit</label>
                <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl bg-slate-50/50">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white shadow-md flex-shrink-0">
                    <img src={previewImage || productToEdit.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <label className="flex-1 flex flex-col items-center justify-center py-4 border-2 border-dashed border-slate-200 rounded-xl hover:border-teal-400 hover:bg-white cursor-pointer transition-all group">
                    <input name="image" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    <Upload className="w-5 h-5 text-teal-600 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-xs text-slate-500 font-medium">Changer la photo</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex flex-col md:flex-row gap-3">
                <button type="button" onClick={() => setProductToEdit(null)} className="flex-1 py-3 px-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                  Annuler
                </button>
                <button type="submit" className="flex-1 py-3 px-4 bg-teal-600 text-white rounded-xl font-bold shadow-lg hover:bg-teal-700 transition-all">
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