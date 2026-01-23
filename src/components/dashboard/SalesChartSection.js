"use client";
import React, { useMemo, useState, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getSalesAnalysis } from '@/services/aiService';

export const SalesChartSection = ({ sales = [] }) => {
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Calcul des données du graphique
  const chartData = useMemo(() => {
    const groups = sales.reduce((acc, s) => {
      acc[s.category] = (acc[s.category] || 0) + (Number(s.price) || 0);
      return acc;
    }, {});
    return Object.entries(groups).map(([name, total]) => ({ name, total }));
  }, [sales]);

  useEffect(() => {
    let isMounted = true;
    
    const fetchAi = async () => {
      // 1. Vérifier si on a déjà une analyse en cache pour ces données
      const cacheKey = `analysis_${sales.length}_${chartData.length}`;
      const cachedResult = sessionStorage.getItem(cacheKey);

      if (cachedResult) {
        setAiAnalysis(cachedResult);
        return;
      }

      if (sales.length > 0 && chartData.length > 0 && !isLoadingAi && !aiAnalysis) {
        setIsLoadingAi(true);
        try {
          const total = chartData.reduce((sum, item) => sum + item.total, 0);
          const result = await getSalesAnalysis(chartData, total, sales.length);
          
          if (isMounted) {
            setAiAnalysis(result);
            // 2. Sauvegarder dans le cache de session
            sessionStorage.setItem(cacheKey, result);
          }
        } catch (error) {
          console.error("Erreur Quota/API:", error);
          setAiAnalysis("Limite de requêtes atteinte. Réessayez dans une minute.");
        } finally {
          if (isMounted) setIsLoadingAi(false);
        }
      }
    };

    fetchAi();
    return () => { isMounted = false; };
  }, [sales.length, chartData.length]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
      {/* Colonne Graphique */}
      <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-400 uppercase mb-6 tracking-wider">Répartition des revenus</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}} 
                contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.05)'}} 
              />
              <Bar dataKey="total" fill="#0d9488" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Colonne IA Insight */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="flex items-center gap-2 mb-4 text-amber-600">
          <Sparkles size={20} className={isLoadingAi ? "animate-spin" : "animate-pulse"} />
          <h3 className="text-xs font-black uppercase tracking-widest">Analyse IA</h3>
        </div>

        <div className="bg-amber-50/50 rounded-[2rem] p-6 border border-amber-100 min-h-[180px] flex items-center justify-center w-full overflow-hidden">
          {isLoadingAi ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="animate-spin text-amber-500" size={24} />
              <span className="text-[10px] font-bold text-amber-600/60 uppercase">Génération en cours...</span>
            </div>
          ) : (
            /* AJOUT DE break-words ET w-full ICI */
            <p className="text-sm text-slate-700 leading-relaxed font-medium break-words w-full">
              {aiAnalysis ? aiAnalysis : "Analyse des données en cours..."}
            </p>
          )}
        </div>
        <p className="mt-4 text-[10px] text-slate-400 italic">Basé sur vos performances actuelles</p>
      </div>
    </div>
  );
};