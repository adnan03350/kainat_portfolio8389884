/* ============================================
   KAINAT AFZAL - AI PORTFOLIO
   Modern Interactive JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initCursorGlow();
    initParticles();
    initNavbar();
    initTypingEffect();
    initCountUp();
    initScrollAnimations();
    initProjectFilter();
    initTiltEffect();
    initMobileMenu();
    initSmoothScroll();
    initProjectsToggle();
});

/* ============================================
   CURSOR GLOW EFFECT
   ============================================ */
function initCursorGlow() {
    const cursorGlow = document.getElementById('cursorGlow');
    if (!cursorGlow) return;
    
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animate() {
        // Smooth follow
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;
        
        cursorGlow.style.left = currentX + 'px';
        cursorGlow.style.top = currentY + 'px';
        
        requestAnimationFrame(animate);
    }
    animate();
}

/* ============================================
   PARTICLE CANVAS ANIMATION
   ============================================ */
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 80;
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - distance / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        connectParticles();
        requestAnimationFrame(animate);
    }
    animate();
}

/* ============================================
   NAVBAR SCROLL EFFECT
   ============================================ */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active link based on scroll position
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateNavbar);
    updateNavbar();
}

/* ============================================
   TYPING EFFECT
   ============================================ */
function initTypingEffect() {
    const typingElement = document.getElementById('typingText');
    if (!typingElement) return;
    
    const texts = [
        'Generative AI Engineer',
        'Machine Learning Expert',
        'Deep Learning Specialist',
        'LLM Developer',
        'AI Solutions Architect'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500; // Pause before next word
        }
        
        setTimeout(type, typingSpeed);
    }
    
    type();
}

/* ============================================
   COUNT UP ANIMATION
   ============================================ */
function initCountUp() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseFloat(element.getAttribute('data-count'));
                animateCount(element, target);
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => observer.observe(stat));
    
    function animateCount(element, target) {
        const duration = 2000;
        const startTime = performance.now();
        const isFloat = target % 1 !== 0;
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = target * easeOut;
            
            if (isFloat) {
                element.textContent = current.toFixed(1);
            } else {
                element.textContent = Math.floor(current);
            }
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
    // Exclude project cards from scroll animations - they should be visible immediately
    const animatedElements = document.querySelectorAll('.glass-card:not(.project-card), .timeline-item, .section-header');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add animation class styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/* ============================================
   PROJECT FILTER
   ============================================ */
function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Add transition styles
    projectCards.forEach(card => {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
}

/* ============================================
   PROJECTS SHOW/HIDE TOGGLE
   ============================================ */
function initProjectsToggle() {
    const showAllBtn = document.getElementById('showAllProjectsBtn');
    const showAllBtnText = document.getElementById('showAllBtnText');
    const showAllBtnIcon = document.getElementById('showAllBtnIcon');
    const hiddenProjects = document.querySelectorAll('.project-card.project-hidden');
    
    if (!showAllBtn || hiddenProjects.length === 0) return;
    
    let allProjectsVisible = false;
    
    showAllBtn.addEventListener('click', function() {
        allProjectsVisible = !allProjectsVisible;
        
        hiddenProjects.forEach((project, index) => {
            if (allProjectsVisible) {
                // Show project with animation
                setTimeout(() => {
                    project.style.display = 'block';
                    project.style.opacity = '0';
                    project.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        project.style.opacity = '1';
                        project.style.transform = 'translateY(0)';
                        project.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    }, 50);
                }, index * 50);
            } else {
                // Hide project with animation
                project.style.opacity = '0';
                project.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    project.style.display = 'none';
                }, 400);
            }
        });
        
        // Update button text and icon
        if (allProjectsVisible) {
            showAllBtnText.textContent = 'Show Less';
            showAllBtnIcon.classList.remove('fa-chevron-down');
            showAllBtnIcon.classList.add('fa-chevron-up');
        } else {
            showAllBtnText.textContent = 'Show All Projects';
            showAllBtnIcon.classList.remove('fa-chevron-up');
            showAllBtnIcon.classList.add('fa-chevron-down');
        }
    });
}

/* ============================================
   TILT EFFECT
   ============================================ */
function initTiltEffect() {
    const tiltCards = document.querySelectorAll('[data-tilt]');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

/* ============================================
   MOBILE MENU
   ============================================ */
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!menuToggle || !navMenu) return;
    
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* ============================================
   SKILL LEVEL ANIMATION
   ============================================ */
function initSkillBars() {
    const skillBars = document.querySelectorAll('.level-bar');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fillBar 1.5s ease forwards';
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => observer.observe(bar));
}

/* ============================================
   PARALLAX EFFECT FOR ORBS
   ============================================ */
function initParallax() {
    const orbs = document.querySelectorAll('.gradient-orb');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.1;
            orb.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });
}

// Initialize parallax
initParallax();

/* ============================================
   MAGNETIC BUTTONS
   ============================================ */
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-glow');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

initMagneticButtons();

/* ============================================
   RANDOM GLITCH EFFECT FOR TEXT
   ============================================ */
function initGlitchEffect() {
    const glitchText = document.querySelector('.text-gradient');
    if (!glitchText) return;
    
    setInterval(() => {
        if (Math.random() > 0.95) {
            glitchText.classList.add('glitch');
            setTimeout(() => glitchText.classList.remove('glitch'), 200);
        }
    }, 100);
}

// Add glitch styles
const glitchStyle = document.createElement('style');
glitchStyle.textContent = `
    .glitch {
        animation: glitch 0.2s ease;
    }
    @keyframes glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
        100% { transform: translate(0); }
    }
`;
document.head.appendChild(glitchStyle);
initGlitchEffect();


/* ============================================
   TESTIMONIALS TOGGLE FUNCTIONALITY
   ============================================ */
function initTestimonialsToggle() {
    const toggleBtn = document.getElementById('toggleTestimonialsBtn');
    const testimonialsGrid = document.getElementById('testimonialsGrid');
    const hiddenTestimonials = document.querySelectorAll('.testimonial-card.hidden');
    const toggleBtnText = document.getElementById('toggleBtnText');
    const toggleBtnIcon = document.getElementById('toggleBtnIcon');

    if (toggleBtn && hiddenTestimonials.length > 0) {
        toggleBtn.addEventListener('click', function() {
            const areHiddenVisible = hiddenTestimonials[0].classList.contains('show');
            
            hiddenTestimonials.forEach(testimonial => {
                if (areHiddenVisible) {
                    testimonial.classList.remove('show');
                    testimonial.style.display = 'none';
                    testimonial.style.opacity = '0';
                    testimonial.style.transform = 'translateY(20px)';
                } else {
                    testimonial.classList.add('show');
                    testimonial.style.display = 'block';
                    testimonial.style.opacity = '1';
                    testimonial.style.transform = 'translateY(0)';
                    testimonial.style.transition = 'all 0.3s ease';
                }
            });

            // Update button text and icon
            if (areHiddenVisible) {
                toggleBtnText.textContent = 'Read All Testimonials';
                toggleBtnIcon.classList.remove('fa-chevron-up');
                toggleBtnIcon.classList.add('fa-chevron-down');
            } else {
                toggleBtnText.textContent = 'Show Less';
                toggleBtnIcon.classList.remove('fa-chevron-down');
                toggleBtnIcon.classList.add('fa-chevron-up');
            }
        });
    }
}

// Initialize testimonials toggle
initTestimonialsToggle();

/* ============================================
   CONSOLE EASTER EGG
   ============================================ */
console.log('%c🤖 Kainat Afzal - AI Engineer Portfolio', 'font-size: 24px; font-weight: bold; color: #6366f1;');
console.log('%cBuilding the future with AI! 🚀', 'font-size: 14px; color: #ec4899;');
console.log('%c👋 Interested in working together? Contact: kainatafzal195@gmail.com', 'font-size: 12px; color: #06b6d4;');
