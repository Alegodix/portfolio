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
  Voici son CV : https://cvdesignr.com/p/698cb75044ff8
  Son profil : 

ALEXANDRE GODINEAU
Étudiant ingénieur informatique | 06 50 45 08 61 alexandre_godineau@proton.me | Portfolio : alegodix.github.io/portfolio
PROFIL
Étudiant en cycle ingénieur passionné par le développement logiciel et l'architecture système. Doté d'une forte culture projet et d'une rigueur forgée par 9 ans de conservatoire, je recherche un contrat d'apprentissage de 3 ans (2026-2029). Mon projet professionnel est orienté vers la souveraineté technologique et la sécurité nationale (Objectif : Officier de Gendarmerie).
COMPÉTENCES TECHNIQUES
•	Langages de programmation : C (expert), C#, Python, Shell/Bash, PHP, JavaScript, HTML5/CSS3.
•	Outils & Environnements : Linux (Debian/Ubuntu), Git/GitHub, Docker, Visual Studio, Unity 3D.
•	Conception & Graphisme : Modélisation 3D (Blender), Suite Adobe (Photoshop), Suite Office 365.
•	Langues : Anglais (Niveau C1 – score TOEIC : 980/990), Français (Maternelle).
FORMATION
Cycle Ingénieur - Spécialité Informatique | CY Tech (ex-EISTI), Cergy | septembre 2026 — juillet 2029
•	Cursus axé sur l'ingénierie logicielle, la cybersécurité et le management de projet.
Classe Préparatoire Intégrée (Filière Mathématiques, Économie, Finance) | CY Tech | septembre 2024 — juillet  2026
•	Informatique : Classement 5ème / 69 (Top 7%).
•	Mathématiques (S3) : 17,5/20 en Analyse dans Rn (Classement : 21e / 193 - Top 10%).
•	Résultats S3 : 10,75/20 en Séries Numériques (Classement : 27e / 205 au partiel final).
PROJETS TECHNIQUES & RÉALISATIONS
MultiverSeus | Développement d'un jeu vidéo en C | Projet de groupe
•	Conception et implémentation des mécaniques de jeu en C de bas niveau.
•	Développement d'une Intelligence Artificielle et d'un mode coopératif.
•	Gestion du versioning via Git et coordination technique de l'équipe (3 personnes).
Portfolio Web & Chatbot Intelligent | Projet Personnel
•	Développement front-end complet (HTML/CSS/JS) en architecture responsive.
•	Intégration d'un chatbot interactif et mise en valeur des projets via GitHub Pages.
WildWater | Analyse & Extraction de Données | Projet Académique
•	Développement d'un outil d'extraction performant en C et scripts Shell.
•	Traitement automatisé de fichiers de données complexes (Big Data/Parsing).
Runner Game | Développement C# / Unity | Projet Personnel
•	Création d'un jeu de type "Runner" : gestion de la physique, des collisions et de l'UI.
EXPÉRIENCES PROFESSIONNELLES
Vendeur Polyvalent | Boulangerie du Marché, Maisons-Alfort | septembre 2024 — juillet 2025
•	Gestion logistique du stand en autonomie totale (installation, stocks, inventaire).
•	Relation client et encaissement en environnement à fort flux.
Animateur en Accueil Collectif de Mineurs (BAFA) | Telligo | juillet 2023
•	Encadrement et sécurité physique/affective d'un groupe d'enfants (6-12 ans).
•	Planification opérationnelle d'activités et gestion des dynamiques de groupe.
PROJETS TRANSVERSES & ENGAGEMENTS
•	Ingénierie Urbaine : Études de végétalisation ("Îlots de fraîcheur") et de restauration d'espaces publics. Rédaction d'états de l'art et soutenance devant jury.
•	Musique : 9 ans de Conservatoire (Saxophone et Guitare). Rigueur et discipline de groupe.
•	Sport : Escalade (niveau régulier en club), développement de la gestion du stress et de l'anticipation.
•	Arts : Dessin et création numérique (Blender).

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