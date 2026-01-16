"use client";

import { useState, useEffect } from 'react'; 
import { useDispatch, useSelector } from 'react-redux';
import { addProductThunk } from '@/store/productsSlice';
import Link from 'next/link';
import { ArrowLeft, Package, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AddProductPage() {
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.products.loading);

    const [formData, setFormData] = useState({
        name: '',
        quantity: '',
        price: '',
        category: 'Électronique',
        description: '',
        image: null
    });

    const [errors, setErrors] = useState({});
    const [preview, setPreview] = useState(null);

    // Gérer l'aperçu de l'image
    useEffect(() => {
        if (!formData.image) {
            setPreview(null);
            return;
        }
        // Création de l'URL temporaire
        const objectUrl = URL.createObjectURL(formData.image);
        setPreview(objectUrl);

        // Nettoyage pour éviter les fuites de mémoire
        return () => URL.revokeObjectURL(objectUrl);
    }, [formData.image]);

    const validate = () => {
        let newErrors = {};
        if (!formData.name) newErrors.name = "Le nom est obligatoire";
        if (!formData.price) newErrors.price = "Le prix est obligatoire";
        if (!formData.quantity) newErrors.quantity = "La quantité est obligatoire";
        if (!formData.image) newErrors.image = "L'image est obligatoire";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, image: e.target.files[0] });
        }
    };

    // Fonction pour vider le formulaire
    const resetForm = () => {
        setFormData({ name: '', quantity: '', price: '', category: 'Électronique', description: '', image: null });
        setErrors({});
        setPreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            const loadToast = toast.loading("Envoi du produit en cours...");

            try {
                await dispatch(addProductThunk(formData)).unwrap();
                toast.success("Produit ajouté avec succès !", { id: loadToast });
                resetForm();
                e.target.reset(); // Réinitialise l'input file HTML
            } catch (err) {
                toast.error("Échec de l'envoi : " + err, { id: loadToast });
            }
        } else {
            toast.error("Veuillez remplir tous les champs");
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 p-4">
            <div className="flex md:justify-start justify-end">
                <Link
                    href="/products"
                    className="inline-flex items-center text-slate-500 hover:text-teal-600 transition-colors font-medium"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <div className="p-3 bg-teal-50 rounded-xl">
                    <Package className="w-8 h-8 text-teal-600" />
                </div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Ajouter un produit</h1>
                    <p className="text-slate-500 text-sm mt-1">Remplissez les informations du produit</p>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nom */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Nom du produit</label>
                        <input 
                            name='name'
                            value={formData.name}
                            onChange={handleChange}
                            type="text" 
                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all ${errors.name ? 'border-red-500' : 'border-slate-200'}`}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Quantité</label>
                            <input name='quantity' value={formData.quantity} onChange={handleChange} type="number" className="w-full px-4 py-3 rounded-xl border border-slate-200" />
                            {errors.quantity && <p className="text-red-500 text-xs">{errors.quantity}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Prix (€)</label>
                            <input name='price' value={formData.price} onChange={handleChange} type="number" className="w-full px-4 py-3 rounded-xl border border-slate-200" />
                            {errors.price && <p className="text-red-500 text-xs">{errors.price}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Catégorie</label>
                        <select name='category' value={formData.category} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white">
                            <option>Électronique</option>
                            <option>Informatique</option>
                            <option>Accessoires</option>
                        </select>
                    </div>

                    {/* Zone Image */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Image du produit</label>
                        <div className="relative">
                            {!preview ? (
                                <label className="border-2 border-dashed border-slate-200 rounded-2xl p-8 hover:border-teal-400 cursor-pointer bg-slate-50/50 flex flex-col items-center justify-center transition-colors">
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    <Upload className="w-8 h-8 text-teal-600 mb-2" />
                                    <p className="text-sm text-slate-600">Cliquez pour ajouter une photo</p>
                                </label>
                            ) : (
                                <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-48 w-full">
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    <button 
                                        type="button"
                                        onClick={() => setFormData({...formData, image: null})}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                        {errors.image && <p className="text-red-500 text-xs">{errors.image}</p>}
                    </div>

                    <div className="pt-4 flex flex-col md:flex-row gap-3">
                        <button 
                            type="button" 
                            onClick={resetForm}
                            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50"
                        >
                            Annuler
                        </button>
                        <button 
                            type="submit" 
                            disabled={isLoading}  
                            className="flex-1 py-3 px-4 rounded-xl bg-teal-600 font-semibold text-white hover:bg-teal-700 shadow-lg disabled:opacity-50 transition-all"
                        >
                            {isLoading ? "Envoi en cours..." : "Enregistrer le produit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}