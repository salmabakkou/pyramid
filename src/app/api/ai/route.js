import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { chartData, totalSales, productsSold } = await req.json();
    const API_KEY = process.env.GEMINI_API_KEY;

    const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;

    const categoriesInfo = chartData.map(c => `${c.name} (${c.total}€)`).join(", ");

    const payload = {
      contents: [{
        parts: [{
          text: `Tu es un analyste business senior. 
          Données : ${totalSales}€ de CA, ${productsSold} produits vendus. Catégories : ${categoriesInfo}.
          
          Rédige un paragraphe d'analyse fluide et professionnel. 
          CONSIGNES STRICTES : 
          - Pas de guillemets ("), pas de listes à puces, pas de caractères spéciaux.
          - Fais des phrases complètes et cohérentes.
          - Commence directement par l'analyse.
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
    let aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Analyse indisponible.";
    
    // Nettoyage de sécurité pour enlever les guillemets si l'IA en met quand même
    aiText = aiText.replace(/["']/g, ""); 

    return NextResponse.json({ analysis: aiText });

  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}