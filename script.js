/* 
   The Digital Archeologist v2.0 - Enhanced Interactions & UI
   Handles loader, scroll progress, particles, mobile menu, and AOS initialization.
*/

document.addEventListener('DOMContentLoaded', () => {
    // Page Loader
    const pageLoader = document.getElementById('pageLoader');
    if (pageLoader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                pageLoader.classList.add('hidden');
                document.body.style.overflowY = 'auto';
            }, 1500);
        });
    }

    // Scroll Progress Bar
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = scrollPercent + '%';
        });
    }

    // Navigation Scroll Effect
    const mainNav = document.querySelector('.main-nav');
    if (mainNav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                mainNav.classList.add('scrolled');
            } else {
                mainNav.classList.remove('scrolled');
            }
        });
    }

    // Particle System for Hero
    const heroParticles = document.getElementById('heroParticles');
    if (heroParticles) {
        const particleCount = 30;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            heroParticles.appendChild(particle);
        }
    }

    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            easing: 'ease-out-cubic'
        });
    }

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Chat Window Toggle
    const aiToggle = document.getElementById('ai-toggle');
    const aiChatWindow = document.getElementById('ai-chat-window');
    const closeChat = document.getElementById('close-chat');
    const apiConfigBtn = document.getElementById('api-config-btn');
    const apiConfigPanel = document.getElementById('api-config-panel');

    if (aiToggle && aiChatWindow) {
        aiToggle.addEventListener('click', () => aiChatWindow.classList.toggle('active'));
        if (closeChat) closeChat.addEventListener('click', () => aiChatWindow.classList.remove('active'));
        if (apiConfigBtn) apiConfigBtn.addEventListener('click', () => {
            apiConfigPanel.style.display = apiConfigPanel.style.display === 'none' ? 'block' : 'none';
        });
    }

    // Enhanced Image Card Effects
    document.querySelectorAll('.image-card, .glass-panel img').forEach(img => {
        const container = img.parentElement;
        if (!container) return;
        
        // Add image-card class if not present
        if (!container.classList.contains('image-card')) {
            container.classList.add('image-card');
        }
        
        // Add overlay if not exists
        if (!container.querySelector('.image-overlay')) {
            const overlay = document.createElement('div');
            overlay.classList.add('image-overlay');
            
            const scanline = document.createElement('div');
            scanline.classList.add('scanline-effect');
            overlay.appendChild(scanline);
            
            const label = document.createElement('span');
            label.classList.add('data-label');
            label.style.fontSize = '0.6rem';
            label.style.marginTop = '1rem';
            label.innerText = 'RECONSTRUCTING_DATA...';
            overlay.appendChild(label);
            
            container.appendChild(overlay);
        }
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.glass-panel, .stat-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    console.log("UI Interactions v2.0 Initialized.");
});
