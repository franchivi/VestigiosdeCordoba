/* 
   The Digital Archeologist - Interactions & AI Core
   Implements "Reconstruction" effects and real-time Gemini AI integration.
*/

import { GoogleGenAI } from 'https://cdn.jsdelivr.net/npm/@google/genai/+esm';

// Add reconstruction overlay to images on hover
document.querySelectorAll('img').forEach(img => {
    const container = img.parentElement;
    if (!container) return;
    
    container.style.position = 'relative';
    container.style.overflow = 'hidden';
    
    const overlay = document.createElement('div');
    overlay.classList.add('reconstruction-overlay');
    overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: repeating-linear-gradient(
            0deg,
            rgba(255, 181, 153, 0.05) 0px,
            rgba(255, 181, 153, 0.05) 1px,
            transparent 1px,
            transparent 2px
        );
        opacity: 0;
        transition: opacity 0.5s ease;
        pointer-events: none;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    `;
    
    const scanline = document.createElement('div');
    scanline.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: var(--primary);
        box-shadow: 0 0 10px var(--primary);
        opacity: 0.5;
        animation: scan 2s linear infinite;
        display: none;
    `;
    overlay.appendChild(scanline);
    
    const label = document.createElement('span');
    label.innerText = 'RECONSTRUCTING_DATA...';
    label.classList.add('data-label');
    label.style.fontSize = '0.6rem';
    overlay.appendChild(label);
    
    container.appendChild(overlay);
    
    container.addEventListener('mouseenter', () => {
        overlay.style.opacity = '1';
        scanline.style.display = 'block';
        img.style.filter = 'blur(2px) grayscale(0.5)';
        img.style.transform = 'scale(1.05)';
    });
    
    container.addEventListener('mouseleave', () => {
        overlay.style.opacity = '0';
        scanline.style.display = 'none';
        img.style.filter = 'none';
        img.style.transform = 'scale(1)';
    });
    
    img.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
});

// Parallax effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    document.querySelectorAll('.light-leak').forEach(leak => {
        leak.style.transform = `translateY(${scrolled * 0.1}px)`;
    });
});

// AI Assistant & Gemini Integration
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 1000, once: true, offset: 100 });
    }

    // Scroll Logic
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Mobile Menu
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => navLinks.classList.remove('active'));
        });
    }

    // --- AI Core ---
    const aiToggle = document.getElementById('ai-toggle');
    const aiChatWindow = document.getElementById('ai-chat-window');
    const closeChat = document.getElementById('close-chat');
    const apiConfigBtn = document.getElementById('api-config-btn');
    const apiConfigPanel = document.getElementById('api-config-panel');
    const apiKeyInput = document.getElementById('api-key-input');
    const saveApiKeyBtn = document.getElementById('save-api-key');
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');

    let geminiApi = null;
    let geminiModel = null;

    // Load API Key
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
        apiKeyInput.value = savedKey;
        initGemini(savedKey);
    }

    function initGemini(key) {
        try {
            geminiApi = new GoogleGenAI({ apiKey: key });
            geminiModel = geminiApi.getGenerativeModel({ 
                model: 'gemini-1.5-flash',
                systemInstruction: "Eres un experto arqueólogo digital especializado en los Vestigios de Córdoba (Sierra de Córdoba, Medina Azahara, Mezquita-Catedral, sistemas mineros y acueductos romanos e islámicos). Tu tono es profesional, técnico pero apasionado, como un terminal de investigación (ARCHEOLOGIST_AI). Utilizas datos estratigráficos, cronologías exactas y terminología técnica. Responde de forma concisa pero informativa, siempre en español."
            });
            console.log("Gemini Core Initialized.");
        } catch (e) {
            console.error("Error initializing Gemini:", e);
        }
    }

    // UI Handlers
    if (aiToggle) aiToggle.addEventListener('click', () => aiChatWindow.classList.toggle('active'));
    if (closeChat) closeChat.addEventListener('click', () => aiChatWindow.classList.remove('active'));
    if (apiConfigBtn) apiConfigBtn.addEventListener('click', () => {
        apiConfigPanel.style.display = apiConfigPanel.style.display === 'none' ? 'block' : 'none';
    });

    if (saveApiKeyBtn) saveApiKeyBtn.addEventListener('click', () => {
        const key = apiKeyInput.value.trim();
        if (key) {
            localStorage.setItem('gemini_api_key', key);
            initGemini(key);
            apiConfigPanel.style.display = 'none';
            addMessage("Protocolo de conexión actualizado. Núcleo Gemini activo.", 'ai');
        }
    });

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
                // Fallback Legacy
                setTimeout(() => {
                    thinkingDiv.remove();
                    addMessage("Error: Conexión Gemini no configurada. Por favor, introduce una API Key válida en el panel de configuración (icono de engranaje).", 'ai');
                }, 1000);
            }
        } catch (e) {
            thinkingDiv.remove();
            addMessage("Fallo en la comunicación con el núcleo: " + e.message, 'ai');
        }
    };

    if (sendBtn) sendBtn.addEventListener('click', handleSend);
    if (userInput) userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });

    console.log("Digital Archeologist System V.2 Initialized.");
});
