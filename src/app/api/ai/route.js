import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { chartData, totalSales, productsSold } = await req.json();
    const API_KEY = process.env.GEMINI_API_KEY;

    // Ton URL conservée
    const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;

    const categoriesInfo = chartData && chartData.length > 0 
      ? chartData.map(c => `${c.name} (${c.total}€)`).join(", ")
      : "aucune catégorie";

    const payload = {
      contents: [{
        parts: [{
          text: `Tu es un analyste business senior. 
          Données : ${totalSales}€ de CA, ${productsSold} produits vendus. Catégories : ${categoriesInfo}.
          
          Rédige un paragraphe d'analyse fluide et professionnel. 
          CONSIGNES STRICTES : 
          - Aucun guillemet, aucune liste, aucun caractère spécial.
          - Phrases complètes.
          - Maximum 30 mots.`
        }]
      }]
    };

    const response = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    // --- ZONE DE DIAGNOSTIC ---
    if (data.error) {
      console.error("Erreur API Gemini:", data.error.message);
      return NextResponse.json({ analysis: `Erreur API: ${data.error.message}` });
    }

    if (!data.candidates || data.candidates.length === 0) {
      console.error("Gemini n'a renvoyé aucun candidat. Vérifiez les filtres de sécurité.");
      return NextResponse.json({ analysis: "L'IA a refusé de répondre pour des raisons de sécurité." });
    }
    // --------------------------

    let aiText = data.candidates[0].content?.parts?.[0]?.text || "Analyse indisponible.";
    
    // Nettoyage final
    aiText = aiText.replace(/["']/g, "").trim(); 

    return NextResponse.json({ analysis: aiText });

  } catch (error) {
    console.error("Erreur serveur Route AI:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}