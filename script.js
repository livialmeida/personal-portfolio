document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. VARIÁVEIS DE ESTADO E CACHE ---
    const langCache = {}; // Guarda as traduções para não baixar o mesmo arquivo 2x
    let currentFontSize = 100; // Tamanho base da fonte em %

    // --- 2. SELETORES (Elementos do DOM) ---
    // Usamos const para garantir que a referência não mude
    const btnPt = document.getElementById('btn-pt');
    const btnEn = document.getElementById('btn-en');
    const btnContrast = document.getElementById('btn-contrast');
    const btnDyslexia = document.getElementById('btn-dyslexia');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const emailBtn = document.getElementById('btn-email-secure');
    const yearSpan = document.getElementById('year');

    // --- 3. FUNÇÕES DE INTERNACIONALIZAÇÃO (i18n) ---
    
    async function setLanguage(lang) {
        try {
            let translations;

            // Verifica se já baixamos esse idioma antes (Cache)
            if (langCache[lang]) {
                translations = langCache[lang];
            } else {
                // Se não, busca o arquivo JSON
                const response = await fetch(`./i18n/${lang}.json`);
                
                if (!response.ok) throw new Error(`Erro ao carregar idioma: ${lang}`);
                
                translations = await response.json();
                langCache[lang] = translations; // Salva no cache
            }

            applyTranslations(translations);
            updateLangButtons(lang);
            
            // Salva a preferência do usuário
            localStorage.setItem('preferredLang', lang);
            
            // Atualiza o atributo lang do HTML (bom para SEO e leitores de tela)
            document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';

        } catch (error) {
            console.error("Erro crítico no i18n:", error);
            // Fallback: Se der erro, não faz nada ou avisa o usuário
        }
    }

    function applyTranslations(translations) {
        // Busca todos os elementos que têm o atributo data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            // Se a chave existir no JSON, atualiza o texto
            if (translations[key]) {
                // Se for um input ou textarea, usa placeholder/value, senão textContent
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translations[key];
                } else {
                    element.textContent = translations[key];
                }
            }
        });
    }

    function updateLangButtons(lang) {
        // Remove a classe active de todos e adiciona só no atual
        if (btnPt) btnPt.classList.toggle('active', lang === 'pt');
        if (btnEn) btnEn.classList.toggle('active', lang === 'en');
    }

    // --- 4. FUNÇÕES DE ACESSIBILIDADE ---

    // Alto Contraste
    if (btnContrast) {
        btnContrast.addEventListener('click', () => {
            document.body.classList.toggle('high-contrast');
            // Salva true ou false no localStorage
            const isActive = document.body.classList.contains('high-contrast');
            localStorage.setItem('highContrast', isActive);
            // Acessibilidade: Avisa o leitor de tela que o botão foi pressionado
            btnContrast.setAttribute('aria-pressed', isActive);
        });
    }

    // Modo Dislexia
    if (btnDyslexia) {
        btnDyslexia.addEventListener('click', () => {
            document.body.classList.toggle('dyslexia-mode');
            const isActive = document.body.classList.contains('dyslexia-mode');
            localStorage.setItem('dyslexiaMode', isActive);
            btnDyslexia.setAttribute('aria-pressed', isActive);
        });
    }

    // Controle de Tamanho da Fonte
    window.adjustFont = (action) => {
        if (action === 'increase' && currentFontSize < 150) currentFontSize += 10;
        else if (action === 'decrease' && currentFontSize > 70) currentFontSize -= 10;
        else if (action === 'reset') currentFontSize = 100;
        
        document.documentElement.style.fontSize = `${currentFontSize}%`;
        localStorage.setItem('fontSize', currentFontSize);
    };

    // Listeners dos botões de fonte
    document.getElementById('btn-font-plus')?.addEventListener('click', () => adjustFont('increase'));
    document.getElementById('btn-font-minus')?.addEventListener('click', () => adjustFont('decrease'));
    document.getElementById('btn-font-reset')?.addEventListener('click', () => adjustFont('reset'));

    // --- 5. UI & NAVEGAÇÃO ---

    // Menu Mobile
    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', () => {
            const isActive = navMenu.classList.toggle('active');
            mobileBtn.setAttribute('aria-expanded', isActive);
            mobileBtn.textContent = isActive ? '✕' : '☰'; // Troca ícone
        });

        // Fechar menu ao clicar em um link (UX básica)
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
                // Opcional: Parar de observar depois de aparecer a primeira vez
                // observer.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.1 }); // Dispara quando 10% do elemento aparece

    document.querySelectorAll('.hidden').forEach(el => observer.observe(el));

    // --- 6. SEGURANÇA (E-mail Ofuscado) ---
    // Isso evita que bots de spam peguem seu e-mail direto no HTML
    if (emailBtn) {
        emailBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Evita comportamento padrão do link vazio
            const user = emailBtn.getAttribute('data-user');
            const domain = emailBtn.getAttribute('data-domain');
            
            // Cria o link mailto dinamicamente apenas no clique
            window.location.href = `mailto:${user}@${domain}`;
        });
    }

    // --- 7. INICIALIZAÇÃO (Boot) ---
    function init() {
        // Data automática no Footer
        if (yearSpan) yearSpan.textContent = new Date().getFullYear();

        // Recuperar Idioma
        const savedLang = localStorage.getItem('preferredLang') || 'pt';
        setLanguage(savedLang);

        // Recuperar Alto Contraste
        if (localStorage.getItem('highContrast') === 'true') {
            document.body.classList.add('high-contrast');
            if(btnContrast) btnContrast.setAttribute('aria-pressed', 'true');
        }

        // Recuperar Modo Dislexia
        if (localStorage.getItem('dyslexiaMode') === 'true') {
            document.body.classList.add('dyslexia-mode');
            if(btnDyslexia) btnDyslexia.setAttribute('aria-pressed', 'true');
        }

        // Recuperar Tamanho da Fonte
        const savedFont = localStorage.getItem('fontSize');
        if (savedFont) {
            currentFontSize = parseInt(savedFont);
            document.documentElement.style.fontSize = `${currentFontSize}%`;
        }

        // Listeners de Idioma
        if(btnPt) btnPt.addEventListener('click', () => setLanguage('pt'));
        if(btnEn) btnEn.addEventListener('click', () => setLanguage('en'));
    }

    // Rodar a inicialização
    init();
});