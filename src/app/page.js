"use client";
import React, { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Package, CircleDollarSign, ShoppingBag, TrendingUp } from 'lucide-react';
import { getProductsThunk } from '@/store/productsSlice';

import { StatCard } from '@/components/dashboard/StatCard';
import { RecentSales } from '@/components/dashboard/RecentSales';
import { SalesChartSection } from '@/components/dashboard/SalesChartSection';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { items: allItems = [] } = useSelector((state) => state.products || {});

  // Charge les données dès l'exécution du code
  useEffect(() => {
    dispatch(getProductsThunk());
  }, [dispatch]);

  // Calculs globaux partagés
  const stats = useMemo(() => {
    const inventory = allItems.filter(item => item.status !== "Vendu");
    const sales = allItems.filter(item => item.status === "Vendu");

    return {
      sales,
      totalStock: inventory.reduce((acc, p) => acc + (Number(p.quantity) || 0), 0),
      stockValue: inventory.reduce((acc, p) => acc + (Number(p.price) * (Number(p.quantity) || 0)), 0),
      productsSold: sales.length,
      totalSales: sales.reduce((acc, s) => acc + (Number(s.price) || 0), 0)
    };
  }, [allItems]);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 space-y-8">
      {/*  Les Cartes de Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Stock total" value={stats.totalStock} icon={Package} bg="bg-white" color="text-slate-600" />
        <StatCard title="Valeur Stock" value={`${stats.stockValue.toLocaleString()}€`} icon={CircleDollarSign} bg="bg-white" color="text-blue-600" />
        <StatCard title="Produits vendus" value={stats.productsSold} icon={ShoppingBag} bg="bg-white" color="text-emerald-600" />
        <StatCard title="Chiffre d'Affaires" value={`${stats.totalSales.toLocaleString()}€`} icon={TrendingUp} bg="bg-white" color="text-teal-600" />
      </div>

      {/*  Graphique + IA  */}
      < SalesChartSection sales={stats.sales} />

      {/*  Tableau  */}
      < RecentSales allItems={allItems} />
    </div>
  );
}