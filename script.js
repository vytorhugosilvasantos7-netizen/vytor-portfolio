// ==========================================
// 1. Animação de Revelar Seções no Scroll
// ==========================================
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal-section');
  const windowHeight = window.innerHeight;
  const elementVisible = 100;

  reveals.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;

    if (elementTop < windowHeight - elementVisible) {
      element.classList.add('active');
    }
  });
}

// Executa a animação ao rolar a página e logo ao carregar
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ==========================================
// 2. Interatividade dos Cards de Tecnologias
// ==========================================
document.querySelectorAll('.tech-card').forEach(card => {
  card.addEventListener('click', () => {
    card.style.transform = 'scale(1.2) rotate(5deg)';
    
    setTimeout(() => {
      card.style.transform = '';
    }, 300);
  });
});

// ==========================================
// 3. Download Automático do Currículo
// ==========================================
function baixarCurriculo() {
    const textoCurriculo = `==================================================
VYTOR HUGO SILVA SANTOS
São Paulo - SP | Tel: (11) 93959-2496
Data de Nascimento: 19/06/2007
==================================================

OBJETIVO PROFISSIONAL
Atuar na área de Desenvolvimento de Software / Programação, aplicando conhecimentos práticos em HTML, CSS, JavaScript e integração de APIs (como Gemini AI). Busco oportunidade de Estágio ou nível Júnior para desenvolver soluções web, automações de processos e evoluir continuamente minhas habilidades em Ciência da Computação.

HABILIDADES TÉCNICAS E PESSOAIS
- Linguagens e Web: HTML5, CSS3, JavaScript (ES6+), manipulação de DOM e localStorage.
- Inteligência Artificial & APIs: Conexão e consumo da API do Google Gemini para assistentes virtuais e análise de dados.
- Tecnologia & Ferramentas: Conhecimentos avançados em informática e lógica de programação.
- Gestão & Negócios: Noções de Administração, Organização e Marketing Digital (estratégias online).
- Soft Skills: Boa comunicação, proatividade, facilidade para aprender novas tecnologias e alta responsabilidade.

FORMAÇÃO E CERTIFICAÇÕES
- Bacharelado em Ciência da Computação — Em andamento
- Curso de Inglês — Concluído
- Informática Básica e Avançada — Concluído
- Marketing Digital & Estratégias Online — Concluído
- Administração — Concluído
- Educação Financeira — Concluído

INFORMAÇÕES ADICIONAIS / PROJETOS PRÁTICOS
- Aplicação Web Financeira com IA: Desenvolvimento de um sistema de controle de gastos utilizando HTML, CSS e JS, integrando a API do Gemini para atuar como consultor financeiro automático e analista de dados.
- Interesse constante em Automação: Prática no desenvolvimento de scripts, integração de APIs e consumo de dados para otimização de fluxos e projetos web.
- Disponibilidade: Total disponibilidade para início imediato e aprendizado contínuo.
`;

    // Cria o arquivo de texto na memória do navegador
    const blob = new Blob([textoCurriculo], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    
    // Nome do arquivo baixado
    link.download = 'Curriculo_Vytor_Hugo.txt';
    
    // Dispara o download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}