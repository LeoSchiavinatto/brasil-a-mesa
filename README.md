# 📘 Brasil à Mesa

### Catálogo interativo de receitas brasileiras

O **Brasil à Mesa** é uma aplicação web estática que organiza e
apresenta receitas tradicionais de todas as regiões do Brasil.\
O projeto funciona totalmente no navegador, sem servidor, e permite
cadastrar, editar, salvar e explorar receitas com filtros inteligentes.

------------------------------------------------------------------------

## 🎯 O que o projeto faz

-   Exibe uma **lista dinâmica de receitas** com busca e filtro por
    região.\
-   Permite **criar, editar e excluir** receitas diretamente na
    interface.\
-   Armazena tudo automaticamente no **localStorage**, funcionando
    offline.\
-   Possui sistema de **favoritos (★)**.\
-   Exibe um **modo de leitura completa** com quebra de linha real e
    botão de copiar.\
-   Inclui páginas especiais:
    -   **Regiões** --- receitas por Norte, Nordeste, Centro-Oeste,
        Sudeste e Sul.\
    -   **Histórias** --- textos culturais sobre a culinária regional.\
    -   **Sobre** --- apresentação do projeto.

------------------------------------------------------------------------

## 🧩 Tecnologias utilizadas

-   **HTML5**
-   **CSS3 (design próprio)**
-   **JavaScript puro (SPA por hash + CRUD + favoritos)**
-   **localStorage**
-   **JSON**
-   **GitHub Pages** (deploy)

------------------------------------------------------------------------

## 📁 Estrutura

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

------------------------------------------------------------------------

## 🚀 Como rodar

Basta abrir o arquivo:

    index.html

Para evitar bloqueios de leitura do JSON, recomenda-se usar um servidor
local:

    npx serve .

ou:

    python3 -m http.server

------------------------------------------------------------------------

## 🌐 Publicação

Projeto publicado via GitHub Pages:\
https://SEU-USUARIO.github.io/brasil-a-mesa

A publicação atualiza automaticamente quando você der *push*.

------------------------------------------------------------------------

## 🔄 Comandos para atualizar o GitHub

    git add .
    git commit -m "Atualização final do projeto"
    git push origin main
