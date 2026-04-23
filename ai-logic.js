/* 
   Archeologist AI - Gemini Engine
   Handles the integration with Google Generative AI (Gemini 1.5 Flash).
*/

import { GoogleGenAI } from 'https://cdn.jsdelivr.net/npm/@google/genai/+esm';

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const apiKeyInput = document.getElementById('api-key-input');
const saveApiKeyBtn = document.getElementById('save-api-key');
const apiConfigPanel = document.getElementById('api-config-panel');

let geminiModel = null;

const addMessage = (text, sender) => {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add(sender === 'ai' ? 'ai-message' : 'user-message', 'message');
    if (sender === 'ai') {
        msgDiv.innerHTML = `<p class="data-label" style="color: var(--primary); font-size: 0.6rem;">// RESPUESTA NÚCLEO</p><p>${text}</p>`;
    } else {
        msgDiv.innerText = text;
    }
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
};

const initGemini = (key) => {
    try {
        const genAI = new GoogleGenAI({ apiKey: key });
        geminiModel = genAI.getGenerativeModel({ 
            model: 'gemini-1.5-flash',
            systemInstruction: "Eres un experto arqueólogo digital especializado en los Vestigios de Córdoba. Tu tono es profesional, técnico pero apasionado. Responde en español de forma concisa."
        });
        console.log("Gemini Engine Active.");
    } catch (e) {
        console.error("Gemini Init Fail:", e);
    }
};

const savedKey = localStorage.getItem('gemini_api_key');
if (savedKey) initGemini(savedKey);

if (saveApiKeyBtn) {
    saveApiKeyBtn.addEventListener('click', () => {
        const key = apiKeyInput.value.trim();
        if (key) {
            localStorage.setItem('gemini_api_key', key);
            initGemini(key);
            apiConfigPanel.style.display = 'none';
            addMessage("Protocolo de conexión actualizado. Núcleo Gemini activo.", 'ai');
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

    try {
        if (geminiModel) {
            const result = await geminiModel.generateContent(text);
            const response = await result.response;
            thinkingDiv.remove();
            addMessage(response.text(), 'ai');
        } else {
            setTimeout(() => {
                thinkingDiv.remove();
                addMessage("Error: Conexión Gemini no configurada. Introduce tu API Key en el panel de herramientas (⚙️).", 'ai');
            }, 1000);
        }
    } catch (e) {
        thinkingDiv.remove();
        addMessage("Fallo en la comunicación con el núcleo: " + e.message, 'ai');
    }
};

if (sendBtn) sendBtn.addEventListener('click', handleSend);
if (userInput) userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });

// Detection for file:// protocol issue
if (window.location.protocol === 'file:') {
    console.warn("ARCHEOLOGIST_AI: ES Modules logic (Gemini) might be blocked on file:// protocol. Use a local server.");
}
