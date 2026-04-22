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

    console.log("Digital Archeologist System Initialized.");
});
