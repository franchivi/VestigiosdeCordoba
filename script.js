/* 
   The Digital Archeologist - Interactions 
   Implements "Reconstruction" effects and cinematic FPV transitions.
*/

// Add reconstruction overlay to images on hover
document.querySelectorAll('img').forEach(img => {
    const container = img.parentElement;
    container.style.position = 'relative';
    container.style.overflow = 'hidden';
    
    // Create reconstruction overlay
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
    
    // Create scanline
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

// Parallax effect for "Digital Archeologist" feel
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    document.querySelectorAll('.light-leak').forEach(leak => {
        leak.style.transform = `translateY(${scrolled * 0.1}px)`;
    });
});

// Consolidate initializations
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }

    // Simple smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // AI Assistant Logic
    const aiToggle = document.getElementById('ai-toggle');
    const aiChatWindow = document.getElementById('ai-chat-window');
    const closeChat = document.getElementById('close-chat');
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');

    if (aiToggle && aiChatWindow) {
        aiToggle.addEventListener('click', () => {
            aiChatWindow.classList.toggle('active');
        });

        closeChat.addEventListener('click', () => {
            aiChatWindow.classList.remove('active');
        });

        const addMessage = (text, sender) => {
            const msgDiv = document.createElement('div');
            msgDiv.classList.add(sender === 'ai' ? 'ai-message' : 'user-message', 'message');
            
            if (sender === 'ai') {
                const label = document.createElement('p');
                label.classList.add('data-label');
                label.style.cssText = 'color: var(--primary); font-size: 0.6rem;';
                label.innerText = '// RESPUESTA NÚCLEO';
                msgDiv.appendChild(label);
            }

            const p = document.createElement('p');
            p.innerHTML = text; // Changed to innerHTML to allow line breaks or formatting if needed
            msgDiv.appendChild(p);
            
            chatMessages.appendChild(msgDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };

        const getAIResponse = (query) => {
            const q = query.toLowerCase();
            
            // Knowledge Base Enrichment
            if (q.includes('mezquita') || q.includes('arco')) 
                return "Analizando estructura... <strong>La Mezquita</strong> es un palimpsesto arquitectónico. Su sistema de arcos dobles (herradura y medio punto) permitió elevar el techo sin perder estabilidad. ¿Sabías que los arcos rojos y blancos imitan la arquitectura romana y bizantina?";
            
            if (q.includes('muro') || q.includes('muralla') || q.includes('defensa')) 
                return "Registros militares detectados: El <strong>Cinturón Defensivo</strong> de la Sierra incluía torres como las Siete Esquinas (858 d.C.). Estas atalayas formaban un sistema de comunicación visual mediante señales de fuego y humo hacia la capital Qurtuba.";
            
            if (q.includes('agua') || q.includes('acueducto') || q.includes('popea') || q.includes('hidraulica')) 
                return "Módulo hídrico activo: El <strong>Aqua Augusta</strong> era una obra maestra de ingeniería de 18km. Los <strong>Baños de Popea</strong> no solo eran estéticos; albergaban el Molino del Martinete, clave para la industria batanera y la molienda de mineral.";
            
            if (q.includes('mina') || q.includes('muriano') || q.includes('cobre')) 
                return "Escaneo de subsuelo completado: <strong>Cerro Muriano</strong> albergó las minas de cobre más productivas del Imperio Romano en Hispania. El pozo San Rafael llegó a los 470m de profundidad bajo control de la Córdoba Copper Co. Ltd.";
            
            if (q.includes('torre') || q.includes('esquinas') || q.includes('heptagonal'))
                return "Ficha técnica: La <strong>Torre de las Siete Esquinas</strong> es única por su planta heptagonal irregular. Esta geometría permitía cubrir ángulos muertos en la vigilancia del estratégico Monasterio de Peña Melaria.";

            if (q.includes('quien eres') || q.includes('que haces'))
                return "Soy el terminal ARCHEOLOGIST_AI. Mi propósito es procesar datos estratigráficos y arqueológicos sobre los vestigios de la Sierra de Córdoba para facilitar tu exploración.";

            if (q.includes('hola') || q.includes('saludos'))
                return "Saludos, explorador. Conexión establecida con el núcleo de datos. ¿Qué coordenadas o vestigio deseas investigar hoy?";

            // Dynamic Fallback
            return "Consulta procesada. No encuentro un registro exacto para '" + query + "', pero mis datos sugieren que te refieres al sistema logístico entre Sierra y Ciudad. ¿Podrías especificar si buscas datos sobre <strong>Minas</strong>, <strong>Acueductos</strong> o <strong>Fortificaciones</strong>?";
        };

        const handleSend = () => {
            const text = userInput.value.trim();
            if (text) {
                addMessage(text, 'user');
                userInput.value = '';
                
                // Add "Thinking" indicator
                const thinkingDiv = document.createElement('div');
                thinkingDiv.classList.add('ai-message', 'message', 'typing');
                thinkingDiv.innerHTML = '<span class="data-label" style="font-size: 0.6rem;">// PROCESANDO_PETICIÓN...</span>';
                chatMessages.appendChild(thinkingDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;

                // Simulate AI computing
                setTimeout(() => {
                    thinkingDiv.remove();
                    const response = getAIResponse(text);
                    addMessage(response, 'ai');
                }, 1200);
            }
        };

        sendBtn.addEventListener('click', handleSend);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }

    console.log("Digital Archeologist System Initialized.");
});
