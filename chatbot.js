// Função principal para inicializar o chatbot
function initChatbot(config) {
  let faqData = [];

  // 1. Carregar a base de dados JSON
  fetch(config.jsonUrl)
    .then(response => response.json())
    .then(data => {
      faqData = data;
      console.log("Base de dados carregada com sucesso!");
    })
    .catch(error => console.error("Erro ao carregar o JSON:", error));

  // 2. Injetar o CSS do Chatbot (Você pode alterar as cores aqui - Passo 5)
  const style = document.createElement('style');
  style.innerHTML = `
    #meu-chatbot-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 300px;
      max-height: 400px;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      display: flex;
      flex-direction: column;
      font-family: Arial, sans-serif;
      display: none; /* Inicia escondido */
      z-index: 9999;
    }
    #chatbot-header {
      background-color: #007BFF; /* COR PRINCIPAL DA SUA MARCA */
      color: #fff;
      padding: 15px;
      border-radius: 10px 10px 0 0;
      font-weight: bold;
      text-align: center;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    #chatbot-close {
      cursor: pointer;
      font-size: 18px;
    }
    #chatbot-messages {
      padding: 15px;
      height: 250px;
      overflow-y: auto;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .msg-balao {
      padding: 10px;
      border-radius: 15px;
      max-width: 80%;
      font-size: 14px;
    }
    .msg-bot {
      background-color: #f1f1f1;
      align-self: flex-start;
      border-bottom-left-radius: 0;
    }
    .msg-user {
      background-color: #007BFF; /* COR DA MENSAGEM DO USUÁRIO */
      color: white;
      align-self: flex-end;
      border-bottom-right-radius: 0;
    }
    #chatbot-input-area {
      display: flex;
      padding: 10px;
      border-top: 1px solid #ddd;
    }
    #chatbot-input {
      flex-grow: 1;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 5px;
      outline: none;
    }
    #chatbot-send {
      background-color: #007BFF; /* COR DO BOTÃO ENVIAR */
      color: white;
      border: none;
      padding: 8px 12px;
      margin-left: 5px;
      border-radius: 5px;
      cursor: pointer;
    }
    #chatbot-toggle-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #007BFF; /* COR DO BOTÃO FLUTUANTE */
      color: white;
      border: none;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      font-size: 24px;
      cursor: pointer;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      z-index: 9998;
    }
  `;
  document.head.appendChild(style);

  // 3. Criar a estrutura HTML do Chatbot
  const chatbotHTML = `
    <button id="chatbot-toggle-btn">💬</button>
    
    <div id="meu-chatbot-container">
      <div id="chatbot-header">
        Atendimento Online
        <span id="chatbot-close">✖</span>
      </div>
      <div id="chatbot-messages">
        <div class="msg-balao msg-bot">Olá! Como posso ajudar você hoje?</div>
      </div>
      <div id="chatbot-input-area">
        <input type="text" id="chatbot-input" placeholder="Digite sua dúvida...">
        <button id="chatbot-send">Enviar</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', chatbotHTML);

  // 4. Lógica de Interação
  const container = document.getElementById('meu-chatbot-container');
  const toggleBtn = document.getElementById('chatbot-toggle-btn');
  const closeBtn = document.getElementById('chatbot-close');
  const sendBtn = document.getElementById('chatbot-send');
  const inputField = document.getElementById('chatbot-input');
  const messagesDiv = document.getElementById('chatbot-messages');

  // Abrir / Fechar Chat
  toggleBtn.addEventListener('click', () => {
    container.style.display = 'flex';
    toggleBtn.style.display = 'none';
  });

  closeBtn.addEventListener('click', () => {
    container.style.display = 'none';
    toggleBtn.style.display = 'block';
  });

  // Função para adicionar mensagens na tela
  function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('msg-balao', sender === 'user' ? 'msg-user' : 'msg-bot');
    msgDiv.textContent = text;
    messagesDiv.appendChild(msgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Rolar para o final
  }

  // Função para buscar a resposta na base de dados JSON
  function getBotResponse(userText) {
    const textoLimpo = userText.toLowerCase();
    let respostaEncontrada = "Desculpe, não entendi. Pode reformular a pergunta ou entrar em contato com nosso suporte?";

    // Procura por palavras-chave na base de dados
    for (let item of faqData) {
      // Verifica se alguma das palavras-chave do JSON está na frase do usuário
      const match = item.palavras_chave.some(palavra => textoLimpo.includes(palavra.toLowerCase()));
      if (match) {
        respostaEncontrada = item.resposta;
        break; // Para de procurar assim que achar uma correspondência
      }
    }
    return respostaEncontrada;
  }

  // Ação de enviar mensagem
  function sendMessage() {
    const text = inputField.value.trim();
    if (text === "") return;

    // Adiciona mensagem do usuário
    addMessage(text, 'user');
    inputField.value = '';

    // Simula um tempinho pensando e adiciona a resposta do bot
    setTimeout(() => {
      const response = getBotResponse(text);
      addMessage(response, 'bot');
    }, 500);
  }

  // Enviar ao clicar no botão ou apertar Enter
  sendBtn.addEventListener('click', sendMessage);
  inputField.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
}