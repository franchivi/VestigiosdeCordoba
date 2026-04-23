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
            p.innerText = text;
            msgDiv.appendChild(p);
            
            chatMessages.appendChild(msgDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };

        const getAIResponse = (query) => {
            const q = query.toLowerCase();
            if (q.includes('mezquita')) return "La Mezquita de Córdoba fue el centro espiritual y político del Califato. Sus arcos bicolores son un prodigio de la ingeniería y estética islámica.";
            if (q.includes('muro') || q.includes('muralla')) return "El recito amurallado de Córdoba protegía la medina. Muchos tramos aún son visibles, especialmente cerca del Alcázar.";
            if (q.includes('agua') || q.includes('acueducto') || q.includes('popea')) return "El acueducto Aqua Augusta suministraba agua a la ciudad. Los Baños de Popea conservan restos de molinos y presas históricas.";
            if (q.includes('mina') || q.includes('muriano')) return "Cerro Muriano fue un centro minero vital desde época romana hasta el siglo XX, extrayendo cobre para todo el Mediterráneo.";
            return "Interesante consulta. Mis registros indican que ese vestigio forma parte del complejo sistema logístico de la Sierra de Córdoba. ¿Deseas más detalles técnicos?";
        };

        const handleSend = () => {
            const text = userInput.value.trim();
            if (text) {
                addMessage(text, 'user');
                userInput.value = '';
                
                // Simulate AI thinking
                setTimeout(() => {
                    const response = getAIResponse(text);
                    addMessage(response, 'ai');
                }, 1000);
            }
        };

        sendBtn.addEventListener('click', handleSend);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }

    console.log("Digital Archeologist System Initialized.");
});
