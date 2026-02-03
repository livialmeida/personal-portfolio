# Portfólio Pessoal | Lívia Almeida 👩‍💻

> **"Tecnologia, gestão e segurança com execução técnica."**

Bem-vindo ao repositório do meu portfólio pessoal. Este projeto tangibiliza minha transição de carreira do Direito para a Engenharia de Software, servindo não apenas como uma vitrine profissional, mas como um exercício prático de **Engenharia de Software Inclusiva e Segura**. Foi desenvolvendo o meu porfólio pessoal que eu me senti "programadora" pela primeira vez em anos de transição de carreira. 

Tendo anos de experiência de atendimento ao público em tribunais, priorizei a acessibilidade na execução deste projeto. Entendo que algo "mínimo" pode gerar muito trabalho para ser feito, mas é exatamente isso que pode mudar a percepção/entendimento de alguém. 

"Em tudo **amar** e **servir**". - Santo Inácio de Loyola 🙏

---

## 💡 Defesa Técnica (Design Rationale)

Ao desenvolver este projeto, a escolha por **Vanilla JS** (sem frameworks) foi intencional para demonstrar domínio dos fundamentos da Web. Cada funcionalidade foi arquitetada com um propósito de engenharia:

### 1. Acessibilidade (A11y) como Requisito Não-Funcional
A inclusão não foi tratada como uma "feature", mas como base do sistema. Não se tratava de uma opção, mas um requisito necessário. 
* **Modo de Alto Contraste Real:** Diferente de "modos escuros" estéticos, implementei um tema de alto contraste (Preto Puro/Amarelo) focado em usuários com baixa visão.
* **Modo Dislexia (Dyslexia Friendly):** Implementação que altera a família tipográfica para fontes de peso irregular (`Comic Sans`/`Verdana`) e expande o espaçamento (`line-height` / `letter-spacing`), reduzindo o "efeito de aglomeração" visual.
* **Semântica ARIA:** Navegação compatível com leitores de tela.

### 2. Segurança no Front-End (Mentalidade Blue Team)
Aplicação de princípios de *Security Hardening* em ambiente estático:
* **Mitigação de Spam:** Para evitar a captura do e-mail por bots de varredura, a tag `mailto:` não existe no HTML estático. Um script JavaScript monta o endereço apenas mediante interação humana (clique), ofuscando o dado sensível. Para maior proteção do e-mail, não utilizei o meu pessoal 😉
* **Proteção contra Reverse Tabnabbing:** Todos os links externos (`target="_blank"`) forçam o uso de `rel="noopener noreferrer"`, prevenindo vulnerabilidades de phishing na aba de origem.
* **OPSEC & Proteção de Identidade:** A utilização de um avatar ilustrativo ao invés de uma foto pessoal não é apenas uma escolha estética, mas uma medida de **Privacidade e Contra-Inteligência**. Após vivenciar situações reais de engenharia social com a utilização indevida de imagem para fraude, adotei a ocultação da face em repositórios públicos como controle preventivo, reduzindo a superfície de ataque para a coleta de dados (OSINT) e personificação.

### 3. Arquitetura de Internacionalização (i18n)
* **O Desafio:** Criar um sistema bilíngue (PT/EN) leve e sem dependências.
* **A Solução:** Engine própria baseada em JSON e `fetch API`. O sistema carrega traduções sob demanda, atualiza o DOM via atributos `data-i18n` e persiste a preferência do usuário no `localStorage`.

---

## 🛠️ Tecnologias Utilizadas

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Git](https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white)

* **Semantic HTML5:** Otimizado para SEO.
* **CSS Variables:** Gestão eficiente de múltiplos temas.
* **Vanilla JavaScript (ES6+):** Async/Await, DOM Manipulation e Módulos.

---

## ☁️ Deploy & CI/CD

O projeto está hospedado na **Vercel**, com pipeline de **Continuous Deployment** configurado:

* **Integração:** O repositório está conectado diretamente à Vercel.
* **Automação:** Qualquer *push* realizado na branch `main` dispara automaticamente uma nova build e deploy, garantindo que o ambiente de produção (`livia-almeida.vercel.app`) esteja sempre sincronizado com a versão mais estável do código.

---

## 📂 Estrutura do Projeto

```text
/
├── index.html        # Estrutura principal com marcação semântica
├── style.css         # Estilos globais e temas (Claro/Contraste/Dislexia)
├── script.js         # Lógica de negócios (i18n, A11y, Segurança)
├── i18n/             # Arquivos de tradução
│   ├── pt.json       # Dicionário Português
│   └── en.json       # Dicionário Inglês
└── images/           # Assets otimizados