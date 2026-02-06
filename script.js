document.addEventListener('DOMContentLoaded', () => {
    // --- 1. STATE VARIABLES AND CACHE ---
    const langCache = {}; // Stores loaded translations to prevent re-fetching
    let currentFontSize = 100; // Base font-size

    // --- 2. SELECTORS (DOM elements) ---
    const btnPt = document.getElementById('btn-pt');
    const btnEn = document.getElementById('btn-en');
    const btnContrast = document.getElementById('btn-contrast');
    const btnDyslexia = document.getElementById('btn-dyslexia');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const emailBtn = document.getElementById('btn-email-secure');
    const yearSpan = document.getElementById('year');

    // --- 3. INTERNATIONALIZATION FUNCTION (i18n) ---
    async function setLanguage(lang) {
        try {
            let translations;

            // Check if we have already downloaded this language before (Cache)
            if (langCache[lang]) {
                translations = langCache[lang];
            } else {
                // If not, fetch the JSON file
                const response = await fetch(`./i18n/${lang}.json`);
                
                if (!response.ok) throw new Error(`Erro ao carregar idioma: ${lang}`);
                
                translations = await response.json();
                langCache[lang] = translations; // Save to cache
            }

            applyTranslations(translations);
            updateLangButtons(lang);
            
            // Save user preference
            localStorage.setItem('preferredLang', lang);
            
            // Update HTML lang attribute (useful for SEO and screen readers)
            document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';

            eggConsoleStatus()

        } catch (error) {
            console.error("Critical error in i18n:", error);
            // Fallback: If an error occurs, do nothing or alert the user
        }
    }

    function applyTranslations(translations) {
        // Find all the elements with the data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            // If the key exists int he JSON, atualiza o texto
            if (translations[key]) {
                // If it's an input or textarea, use placeholder/value, otherwise textContent
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translations[key];
                } else {
                    element.textContent = translations[key];
                }
            }
        });
    }

    function updateLangButtons(lang) {
        // Remove active class from all and add only to the current one 
        if (btnPt) btnPt.classList.toggle('active', lang === 'pt');
        if (btnEn) btnEn.classList.toggle('active', lang === 'en');
    }

    // --- 4. ACCESSIBILITY FUNCTIONS ---
    // High Contrast
    if (btnContrast) {
        btnContrast.addEventListener('click', () => {
            document.body.classList.toggle('high-contrast');
            // Save true or false to localStorage
            const isActive = document.body.classList.contains('high-contrast');
            localStorage.setItem('highContrast', isActive);
            // Accessibility: Notify screen reader that the button was pressed
            btnContrast.setAttribute('aria-pressed', isActive);
        });
    }

    // Dyslexia Mode
    if (btnDyslexia) {
        btnDyslexia.addEventListener('click', () => {
            document.body.classList.toggle('dyslexia-mode');
            const isActive = document.body.classList.contains('dyslexia-mode');
            localStorage.setItem('dyslexiaMode', isActive);
            btnDyslexia.setAttribute('aria-pressed', isActive);
        });
    }

    // Font Size Control
    window.adjustFont = (action) => {
        if (action === 'increase' && currentFontSize < 150) currentFontSize += 10;
        else if (action === 'decrease' && currentFontSize > 70) currentFontSize -= 10;
        else if (action === 'reset') currentFontSize = 100;
        
        document.documentElement.style.fontSize = `${currentFontSize}%`;
        localStorage.setItem('fontSize', currentFontSize);
    };

    // Font button listeners
    document.getElementById('btn-font-plus')?.addEventListener('click', () => adjustFont('increase'));
    document.getElementById('btn-font-minus')?.addEventListener('click', () => adjustFont('decrease'));
    document.getElementById('btn-font-reset')?.addEventListener('click', () => adjustFont('reset'));

    // --- 5. UI & NAVIGATION ---
    // Mobile Menu
    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', () => {
            const isActive = navMenu.classList.toggle('active');
            mobileBtn.setAttribute('aria-expanded', isActive);
            mobileBtn.textContent = isActive ? '✕' : '☰'; // Troca ícone
        });

        // Close menu when clicking a link (Basic UX)
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileBtn.setAttribute('aria-expanded', 'false');
                mobileBtn.textContent = '☰';
            });
        });
    }

    // Scroll Animation (Observer)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.1 }); // Fires when 10% of the element appears

    document.querySelectorAll('.hidden').forEach(el => observer.observe(el));

    // --- 6. SECURITY (Obfuscated E-mail) ---
    // This prevents spam bots from scraping your email directly from the HTML
    if (emailBtn) {
        emailBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default behavior of empty link
            const user = emailBtn.getAttribute('data-user');
            const domain = emailBtn.getAttribute('data-domain');
            
            // Dynamically create the mailto link only on click
            window.location.href = `mailto:${user}@${domain}`;
        });
    }

    // --- 7. EASTER EGGS (The "das Neves" console logic)
    // Detects browser language to delivery the right punchline/professional context
    function eggConsoleStatus() {
        const savedLang = localStorage.getItem('preferredLang');
        const browserLang = navigator.language || navigator.userLanguage;
        const isPortuguese = savedLang === 'pt' || (!savedLang && browserLang.startsWith('pt'));
        console.clear();

        if (isPortuguese) {
            // BRASIL/PORTUGAL (Dev Humor + Ice Reference)
            console.log(
                "%c❄️ LÍVIA DAS NEVES | BLUE TEAM",
                "background: #0284c7; color: #fff; padding: 5px 10px; border-radius: 4px; font-family: monospace; font-weight: bold;"
            ); 
            console.log(
                "%cStatus: Sistema Operante. \nO sobrenome 'das Neves' garante proteção extra contra superaquecimento da CPU.",
                "color: #0369a1; font-family: monospace;"
            ); 
        } else {
            // INTERNATIONAL (Legal Authority + Career Transition)
            console.log(
                "%c❄️ LÍVIA DAS NEVES | SECURITY ENGINEER",
                "background: #0284c7; color: #fff; padding: 5px 10px; border-radius: 4px; font-family: monospace; font-weight: bold;"
            );
            console.log(
                "%cDefending rights since 2019. Securing code since 2023. \nFun fact: 'das Neves' means 'of the Snows'. \nKeeping your data cool, compliant, and safe.",
                "color: #0369a1; font-family: monospace; line-height: 1.5;"
            );
        }
    }

    // Keep the tab title trick (lightweight and fun)
    function eggTabTitle() {
        let originalTitle = document.title;
        window.addEventListener('blur', () => {document.title = "Volta aqui! 🥶"; });
        window.addEventListener('focus', () => {document.title = originalTitle; });
    }

    // --- 8. INITIALIZATION (Boot) ---
    function init() {
        // Automatic date in Footer
        if (yearSpan) yearSpan.textContent = new Date().getFullYear();

        // Retrieve language
        const savedLang = localStorage.getItem('preferredLang') || 'pt';
        setLanguage(savedLang);

        // Retrieve high contrast
        if (localStorage.getItem('highContrast') === 'true') {
            document.body.classList.add('high-contrast');
            if(btnContrast) btnContrast.setAttribute('aria-pressed', 'true');
        }

        // Retrieve dyslexia mode
        if (localStorage.getItem('dyslexiaMode') === 'true') {
            document.body.classList.add('dyslexia-mode');
            if(btnDyslexia) btnDyslexia.setAttribute('aria-pressed', 'true');
        }

        // Retrieve font size
        const savedFont = localStorage.getItem('fontSize');
        if (savedFont) {
            currentFontSize = parseInt(savedFont);
            document.documentElement.style.fontSize = `${currentFontSize}%`;
        }

        // Language listeners
        if(btnPt) btnPt.addEventListener('click', () => setLanguage('pt'));
        if(btnEn) btnEn.addEventListener('click', () => setLanguage('en'));

        // Load easter eggs
        eggConsoleStatus();
        eggTabTitle();
    }

    // Run initialization
    init();
});