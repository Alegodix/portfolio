// api/chat.js

export default async function handler(req, res) {
  // On n'accepte que les requêtes POST (envoi de données)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  // On récupère le message envoyé par ton site
  const userMessage = req.body.message;

  // Récupération de la clé secrète stockée en sécurité sur Vercel
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ reply: "Erreur serveur : Clé API manquante." });
  }

  // Le "System Prompt" : On donne une identité à l'IA
  const systemPrompt = `Tu es l'assistant virtuel d'Alexandre Godineau sur son portfolio. 
  Alexandre est étudiant en 2ème année de prépa à l'école d'ingénieurs CY Tech (top 8% de sa promo). 
  Il recherche activement un contrat d'alternance de 3 ans pour septembre 2026 en informatique/développement.
  Tes réponses doivent être courtes, professionnelles, encourageantes et inciter le recruteur à télécharger son CV ou le contacter.
  Réponds directement à cette question du visiteur :`;

  try {
    // Appel à l'API de Gemini (Google)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ text: `${systemPrompt}\n\nVisiteur: ${userMessage}` }] 
        }]
      })
    });

    const data = await response.json();
    
    // On extrait la réponse de l'objet JSON complexe renvoyé par l'API
    const botReply = data.candidates[0].content.parts[0].text;

    // On renvoie la réponse au site web
    res.status(200).json({ reply: botReply });

  } catch (error) {
    console.error("Erreur API:", error);
    res.status(500).json({ reply: "Oups, mes circuits sont un peu emmêlés. Vous pouvez contacter Alexandre par mail !" });
  }
}