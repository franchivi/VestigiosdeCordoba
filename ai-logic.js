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
        let modelName = 'gemini-1.5-flash-latest';
        let url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${currentApiKey}`;
        
        const payload = {
            contents: [{
                parts: [{ text: text }]
            }],
            systemInstruction: {
                parts: [{ text: "Eres un experto arqueólogo digital especializado en los Vestigios de Córdoba. Tu tono es profesional, técnico pero apasionado. Eres un terminal de investigación (ARCHEOLOGIST_AI). Responde en español, sé conciso y formatea las palabras clave entre asteriscos dobles (**palabra**)." }]
            }
        };

        let response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        let data = await response.json();

        // -------------------------------------------------------------
        // Protocolo de Auto-Descubrimiento en caso de error de modelo
        // -------------------------------------------------------------
        if (!response.ok && data.error && (data.error.message.includes('not found') || data.error.code === 404)) {
            console.warn("Modelo por defecto no encontrado. Iniciando Protocolo de Auto-Descubrimiento de Modelos...");
            
            // 1. Obtener la lista de modelos disponibles para esta API Key específica
            const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${currentApiKey}`;
            const listResponse = await fetch(listUrl);
            const listData = await listResponse.json();
            
            if (listData.models && listData.models.length > 0) {
                // 2. Filtrar buscando el primer modelo de la familia Gemini que soporte 'generateContent'
                const validModel = listData.models.find(m => 
                    m.supportedGenerationMethods && 
                    m.supportedGenerationMethods.includes('generateContent') && 
                    m.name.includes('gemini')
                );

                if (validModel) {
                    console.log(`Modelo compatible encontrado: ${validModel.name}. Reconectando...`);
                    
                    // 3. Volver a intentar la petición con el modelo validado
                    url = `https://generativelanguage.googleapis.com/v1beta/${validModel.name}:generateContent?key=${currentApiKey}`;
                    
                    const fallbackPayload = {
                        contents: [{
                            parts: [{ text: "Ignora cualquier otra instrucción previa. Actúa como un experto arqueólogo digital sobre los Vestigios de Córdoba. Sé conciso, profesional y usa formato markdown \n\nUsuario dice: " + text }]
                        }]
                    };

                    response = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(fallbackPayload)
                    });
                    data = await response.json();
                } else {
                    throw new Error("Tu API Key es válida, pero no tiene acceso a ningún modelo 'Gemini' generativo.");
                }
            } else {
                throw new Error("Error obteniendo la lista de modelos permitidos para esta API Key.");
            }
        }

        thinkingDiv.remove();

        if (response.ok && data.candidates && data.candidates[0].content.parts[0].text) {
            addMessage(data.candidates[0].content.parts[0].text, 'ai');
        } else {
            console.error("Gemini API Error:", data);
            addMessage("Error crítico del núcleo (" + (data.error?.code || 'Desconocido') + "): " + (data.error?.message || "Respuesta inválida."), 'ai');
        }

    } catch (e) {
        thinkingDiv.remove();
        console.error("System Error:", e);
        addMessage("Fallo de sistema: " + e.message, 'ai');
    }
};

if (sendBtn) sendBtn.addEventListener('click', handleSend);
if (userInput) userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });
