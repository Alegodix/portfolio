document.addEventListener('DOMContentLoaded', () => {
  const chatToggle = document.getElementById('chat-toggle');
  const chatClose  = document.getElementById('chat-close');
  const chatbot    = document.getElementById('chatbot');
  const chatbox    = document.getElementById('chatbox');
  const chatForm   = document.getElementById('chat-form');
  const userInput  = document.getElementById('userInput');

  // Ouvrir / fermer (Ton code d'origine)
  chatToggle.addEventListener('click', () => {
    chatbot.classList.add('open');
    chatToggle.style.display = 'none';
    chatbot.setAttribute('aria-hidden', 'false');
    setTimeout(() => userInput.focus(), 100);
  });

  chatClose.addEventListener('click', () => {
    chatbot.classList.remove('open');
    chatToggle.style.display = 'block';
    chatbot.setAttribute('aria-hidden', 'true');
  });

  // Message d'accueil
  appendMessage('bot', "Bonjour ! Je suis l'assistant IA d’Alexandre. Posez-moi vos questions sur son parcours à CY Tech, ses projets ou ses compétences !");

  // NOUVEAU : Fonction Asynchrone pour appeler l'IA
  async function fetchAIResponse(userMessage) {
    try {
      /* URL de l'API Vercel */
      const API_URL = "https://portfolio-algo.vercel.app/api/chat"; 
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userMessage }) // On envoie le message de l'utilisateur
      });

      if (!response.ok) {
        throw new Error("Erreur réseau de l'API");
      }

      const data = await response.json();
      return data.reply; // On suppose que l'API renvoie { "reply": "La réponse de l'IA" }

    } catch (error) {
      console.error("Erreur avec l'IA:", error);
      return "Désolé, mes circuits surchauffent un peu. Vous pouvez contacter Alexandre directement par mail !";
    }
  }

  // Utilitaires (Ton code d'origine)
  function escapeHTML(str) {
    const p = document.createElement('p');
    p.textContent = str;
    return p.innerHTML;
  }
  
  function appendMessage(sender, html) {
    const div = document.createElement('div');
    div.className = `msg ${sender}`;
    div.innerHTML = html;
    chatbox.appendChild(div);
    chatbox.scrollTop = chatbox.scrollHeight; // Scroll auto vers le bas
  }

  // NOUVEAU : Gestion de l'envoi avec l'attente (await)
  chatForm.addEventListener('submit', async (e) => { // Ajout du mot-clé 'async'
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;

    // 1. Affiche le message de l'utilisateur
    appendMessage('user', escapeHTML(message));
    userInput.value = ''; // On vide le champ de texte
    userInput.focus();

    // 2. Affiche l'indicateur "l'IA écrit..."
    const typing = document.createElement('div');
    typing.className = 'msg bot typing';
    typing.textContent = 'L\'IA réfléchit...';
    typing.id = 'typing-indicator'; // Un ID pour le retrouver facilement
    chatbox.appendChild(typing);
    chatbox.scrollTop = chatbox.scrollHeight;

    // 3. Appel de la vraie IA (On attend la réponse)
    const reply = await fetchAIResponse(message);

    // 4. Supprime l'indicateur et affiche la vraie réponse
    document.getElementById('typing-indicator').remove();
    appendMessage('bot', reply);
  });
});