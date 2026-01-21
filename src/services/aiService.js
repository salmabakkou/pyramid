export const getSalesAnalysis = async (chartData, totalSales, productsSold) => {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chartData, totalSales, productsSold }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de l’appel API');
    }

    const data = await response.json();
    return data.analysis;
  } catch (error) {
    console.error("Erreur Service IA:", error.message);
    return "L'analyse automatique est temporairement indisponible.";
  }
};