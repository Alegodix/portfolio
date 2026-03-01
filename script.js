document.addEventListener('DOMContentLoaded', () => {
  const chatToggle = document.getElementById('chat-toggle');
  const chatClose  = document.getElementById('chat-close');
  const chatbot    = document.getElementById('chatbot');
  const chatbox    = document.getElementById('chatbox');
  const chatForm   = document.getElementById('chat-form');
  const userInput  = document.getElementById('userInput');

  // Ouvrir / fermer
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

  // Mini "IA" par règles simples
  appendMessage('bot', "Bonjour ! Je suis le mini-assistant d’Alexandre. Posez-moi une mini-question sur ses projets, son GitHub ou son contact.");

  function miniAI(message) {
    const msg = message.toLowerCase();

    const rules = [
      { test: /^(bonjour|salut|bonsoir|hello|hi)\b/i,
        answer: "N'hésitez pas à me poser une mini-question !" },

      { test: /(mail|email|contacter|contact)/,
        answer: "Voulez-vous écrire à <a href='mailto:alexandre_godineau@proton.me'>alexandre_godineau@proton.me</a>." },

       { test: /(blender|3d|3D)/,
        answer: "Il n'y a pas de code ou de dépôt GitHub pour ce projet" },

      { test: /\brunner\b/,
        answer: "Runner : jeu Unity (C#) avec animations et vitesse progressive. Code : <a href='https://github.com/Alegodix/Runner' target='_blank' rel='noopener'>GitHub</a>." },

      { test: /(multiverseus|tour[- ]?par[- ]?tour|\bjeu\b.*\bc\b)/,
        answer: "MultiverSeus : combat tour-par-tour en C pur (sans moteur), à 3. Lien du code sur GitHub ici : <a href='https://github.com/cardotbutzneo/projet_info' target='_blank' rel='noopener'>ici</a>." },

      { test: /(portfolio|site|ce site)/,
        answer: "Ce site est fait en HTML5/CSS. Lien du code sur GitHub ici : <a href='https://github.com/Alegodix/portfolio_chatbot' target='_blank' rel='noopener'>Lien sur GitHub</a>." },

      { test: /\bgithub\b/,
        answer: "Le GitHub d’Alexandre : <a href='https://github.com/Alegodix' target='_blank' rel='noopener'>@Alegodix</a>." },

      { test: /\bcv\b|curriculum/,
        answer: "Lien du CV d'Alexandre : <a href='https://cvdesignr.com/p/lkoXEjYQ744Qa39' target='_blank' rel='noopener'>Lien du CV</a>." },
    ];

    for (const r of rules) {
      if (r.test.test(msg)) return r.answer;
    }
    if (msg.length < 4) return "Peux-tu préciser ta question ?";
    return "Merci pour ton message ! Tu peux me parler de Runner, MultiverSeus, du GitHub, du CV ou demander le contact.";
  }

  // Utilitaires
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
    chatbox.scrollTop = chatbox.scrollHeight;
  }

  // Envoi : via le formulaire (Enter + bouton)
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage('user', escapeHTML(message));

    // Indicateur de saisie
    const typing = document.createElement('div');
    typing.className = 'msg bot typing';
    typing.textContent = '…';
    chatbox.appendChild(typing);
    chatbox.scrollTop = chatbox.scrollHeight;

    setTimeout(() => {
      typing.remove();
      const reply = miniAI(message);
      appendMessage('bot', reply);
    }, 300);

    userInput.value = '';
    userInput.focus();
  });
});