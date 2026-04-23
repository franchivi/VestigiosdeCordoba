/* 
   Archeologist AI - Gemini Engine (REST API Version)
   Handles the integration with Google Generative AI via direct HTTP requests.
   This version is optimized to work even on local file:// protocols.
*/

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const apiKeyInput = document.getElementById('api-key-input');
const saveApiKeyBtn = document.getElementById('save-api-key');
const apiConfigPanel = document.getElementById('api-config-panel');

let currentApiKey = null;

const addMessage = (text, sender) => {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add(sender === 'ai' ? 'ai-message' : 'user-message', 'message');
    if (sender === 'ai') {
        // Convert basic markdown-like bold to HTML for better readability
        const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        msgDiv.innerHTML = `<p class="data-label" style="color: var(--primary); font-size: 0.6rem;">// RESPUESTA NÚCLEO</p><p>${formattedText}</p>`;
    } else {
        msgDiv.innerText = text;
    }
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
};

const savedKey = localStorage.getItem('gemini_api_key');
if (savedKey) {
    currentApiKey = savedKey;
    apiKeyInput.value = savedKey;
}

if (saveApiKeyBtn) {
    saveApiKeyBtn.addEventListener('click', () => {
        const key = apiKeyInput.value.trim();
        if (key) {
            localStorage.setItem('gemini_api_key', key);
            currentApiKey = key;
            apiConfigPanel.style.display = 'none';
            addMessage("Protocolo de conexión actualizado. Núcleo Gemini activo.", 'ai');
        } else {
            addMessage("Error: La llave no puede estar vacía.", 'ai');
        }
    });
}

const handleSend = async () => {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    userInput.value = '';

    const thinkingDiv = document.createElement('div');
    thinkingDiv.classList.add('ai-message', 'message');
    thinkingDiv.innerHTML = '<span class="data-label" style="font-size: 0.6rem;">// PROCESANDO_PETICIÓN_GEMINI...</span>';
    chatMessages.appendChild(thinkingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    if (!currentApiKey) {
        setTimeout(() => {
            thinkingDiv.remove();
            addMessage("Error crítico: Conexión Gemini no configurada. Por favor, haz clic en el icono del engranaje (⚙️) e introduce tu API Key. Puedes conseguir una gratis en Google AI Studio.", 'ai');
        }, 1000);
        return;
    }

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${currentApiKey}`;
        
        const payload = {
            contents: [{
                parts: [{ text: text }]
            }],
            systemInstruction: {
                parts: [{ text: "Eres un experto arqueólogo digital especializado en los Vestigios de Córdoba. Tu tono es profesional, técnico pero apasionado. Eres un terminal de investigación (ARCHEOLOGIST_AI). Responde en español, sé conciso y formatea las palabras clave entre asteriscos dobles (**palabra**)." }]
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        thinkingDiv.remove();

        if (response.ok && data.candidates && data.candidates[0].content.parts[0].text) {
            addMessage(data.candidates[0].content.parts[0].text, 'ai');
        } else {
            console.error("Gemini API Error:", data);
            addMessage("Error en la respuesta del núcleo: " + (data.error?.message || "Respuesta inválida"), 'ai');
        }

    } catch (e) {
        thinkingDiv.remove();
        console.error("Fetch Error:", e);
        addMessage("Fallo de red al comunicar con el núcleo Gemini. Verifica tu conexión a internet.", 'ai');
    }
};

if (sendBtn) sendBtn.addEventListener('click', handleSend);
if (userInput) userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });
