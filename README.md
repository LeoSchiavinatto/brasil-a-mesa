<p align="center">
  <img src="assets/hero.jpg" alt="Brasil à Mesa - Hero" width="100%" />
</p>

<h1 align="center">🇧🇷 Brasil à Mesa</h1>

<p align="center">
  Catálogo interativo de receitas brasileiras por região
</p>

<p align="center">
  <strong>Autor:</strong> Leonardo Schiavinatto da Silva
</p>

<p align="center">
  <a href="https://leoschiavinatto.github.io/brasil-a-mesa/">
    🔗 Acessar aplicação (GitHub Pages)
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E" />
  <img src="https://img.shields.io/badge/Status-Estável-brightgreen?style=for-the-badge" />
</p>

---


🇧🇷 Brasil à Mesa
Catálogo interativo de receitas brasileiras por região

Autor: Leonardo Schiavinatto da Silva
Projeto desenvolvido individualmente para as disciplinas de Extensão da UniFil.

🎯 Visão Geral

Brasil à Mesa é uma aplicação web dedicada a apresentar receitas tradicionais das cinco regiões do Brasil, valorizando a cultura gastronômica nacional.

A aplicação funciona 100% no navegador, com persistência local via localStorage, permitindo:

Explorar receitas por região.

Buscar por nome, ingrediente ou categoria.

Criar, editar e excluir receitas.

Salvar e acessar favoritos.

Ler o preparo completo em diálogo dedicado, com quebra de linha real e opção de copiar.

Navegar pelas páginas de Histórias e Sobre, com conteúdo cultural contextualizado.

👨‍💻 Desenvolvedor

Leonardo Schiavinatto da Silva
Desenvolvimento completo (modelagem, implementação, estilização, testes, publicação).

🧩 Funcionalidades
Página Inicial

Hero com imagem temática e chamada principal.

Receitas

Busca dinâmica.

Filtro por região.

Marcar como favorito (★).

Criar, editar e excluir receitas.

Dialog de leitura com preparo completo e botão de copiar texto.

Regiões

Navegação por Norte, Nordeste, Centro-Oeste, Sudeste e Sul.

Lista automática de receitas filtradas.

Histórias

Textos originais sobre cultura gastronômica de cada região.

Sobre

Explicação do propósito, impacto cultural e tecnologias usadas.

Perfil Local

Estatísticas de receitas e favoritos.

Limpeza total dos dados do navegador.

🛠 Tecnologias Utilizadas

HTML5 (SPA por hash)

CSS3 (tema “Brasil à Mesa”, responsividade, hero, grid, dialogs)

JavaScript (ES6+) (CRUD completo, filtros, favoritos, diálogos, navegação)

localStorage

JSON

Git + GitHub

GitHub Pages (deploy estático)

Oracle Cloud (servidor Nginx opcional)

📁 Estrutura do Projeto
brasil-a-mesa/
│
├── index.html
├── styles.css
├── app.js
│
├── data/
│   └── receitas.json
│
└── assets/
    └── hero.jpg

🚀 Como Executar Localmente
Método rápido (sem servidor):

Abra o arquivo index.html no navegador.

Método recomendado (para evitar bloqueios de JSON):
Node.js
npx serve .

Python
python -m http.server 5500
# Acesse: http://localhost:5500

🌐 Publicações
GitHub Pages

https://leoschiavinatto.github.io/brasil-a-mesa/

Oracle Cloud

Aplicação também hospedada em uma VM com Nginx.
IP público: (substituir pelo seu IP quando subir)

📊 Diagramas UML
Casos de Uso
graph LR
  U[«Ator» Usuário]

  subgraph S[Sistema: Brasil à Mesa]
    UC1(Listar receitas)
    UC2(Buscar / Filtrar receitas)
    UC3(Criar receita)
    UC4(Editar receita)
    UC5(Excluir receita)
    UC6(Favoritar receita)
    UC7(Ver preparo completo)
  end

  U --> UC1
  U --> UC2
  U --> UC3
  U --> UC4
  U --> UC5
  U --> UC6
  U --> UC7

Sequência — Carregamento e Criação
sequenceDiagram
  actor U as Usuário
  participant UI as Interface
  participant LS as localStorage
  participant JSON as data/receitas.json

  U->>UI: Acessa aplicação
  UI->>LS: getItem(KEY)
  alt Base encontrada
    LS-->>UI: Retorna base
    UI->>UI: Renderiza lista
  else Base ausente
    LS-->>UI: null
    UI->>JSON: fetch receitas.json
    JSON-->>UI: Base inicial
    UI->>LS: setItem(KEY)
    UI->>UI: Renderiza lista inicial
  end

  U->>UI: Criar receita
  UI->>LS: Atualiza base
  UI->>UI: Atualiza lista

🔄 Atualizar no GitHub
git add .
git commit -m "README atualizado + melhorias gerais"
git push origin main

📝 Licença

Projeto para uso educacional e acadêmico.