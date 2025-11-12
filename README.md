# 🇧🇷 Brasil à Mesa

Aplicação web estática (HTML, CSS e JavaScript) que reúne e celebra **as receitas regionais brasileiras**, valorizando a cultura e a diversidade gastronômica do país.  
O projeto funciona **100% offline**, sem APIs externas, utilizando **localStorage** para armazenamento dos dados.

---

## 🌎 Conceito e Identidade Visual

**Marca:** “Brasil à Mesa”  
**Tagline:** *Onde cada receita é um pedaço do nosso país.*

A aplicação adota uma identidade visual inspirada na culinária brasileira:
- **Cor principal:** Verde-terra (sofisticado e natural)  
- **Cor secundária:** Terracota (calor, barro, fogão a lenha)  
- **Cor de acento:** Dourado suave (milho, azeite de dendê, sol)  
- **Neutros:** Bege e branco quebrado (linho, papel kraft)

**Tipografia:**  
- Títulos: *Playfair Display* (elegante e clássica)  
- Texto corrido: *Inter* (limpa e legível)

---

## 🖥️ Funcionalidades

- **Catálogo de receitas** organizadas por região (Norte, Nordeste, Centro-Oeste, Sudeste e Sul)  
- **CRUD completo:** criar, editar e excluir receitas  
- **Favoritos:** salvar receitas preferidas  
- **Filtro e busca:** por nome, ingrediente ou região  
- **SPA (Single Page Application):** páginas internas com hash-router  
  - Início  
  - Receitas  
  - Regiões  
  - Histórias  
  - Sobre  
- **Responsivo:** adapta-se a telas de celular, tablet e desktop  
- **Persistência local:** dados armazenados no navegador (localStorage)

---

## ⚙️ Estrutura do Projeto

📁 brasil-a-mesa/
├── index.html # Estrutura da aplicação e navegação SPA
├── styles.css # Identidade visual e layout
├── app.js # Lógica de CRUD, filtros, favoritos e rotas
├── data/
│ └── receitas.json # Base inicial de receitas regionais
├── assets/
│ └── hero.jpg # Imagem principal do site (hero section)
└── README.md # Documentação do projeto

---

## 🧩 Rodar localmente

1. No terminal, entre na pasta do projeto  
2. Execute:

```bash
python -m http.server 5500

Abra no navegador:
👉 http://localhost:5500

☁️ Publicação

GitHub Pages:
Hospedado diretamente no GitHub Pages.

🔗 Link: https://leoschiavinatto.github.io/brasil-a-mesa/


🧱 Diagramas UML
Diagrama de Classes
classDiagram
  class Receita {
    +string id
    +string nome
    +string regiao
    +string categoria
    +string ingredientes
    +string preparo
  }

  class Regiao {
    +string nome
    +list<Receita> receitas
  }

  Regiao --> Receita

Diagrama de Sequência (Salvar Receita)
sequenceDiagram
  actor Usuário
  participant Form
  participant App as app.js
  participant LS as localStorage

  Usuário->>Form: Preenche e clica "Salvar"
  Form->>App: Envia dados da nova receita
  App->>LS: Armazena dados
  App->>Form: Atualiza lista renderizada

📜 Créditos e Contexto Acadêmico

Projeto desenvolvido como parte da disciplina Extensão VI – UniFil
Tema: “Brasil à Mesa: onde cada receita é um pedaço do nosso país.”
Objetivo: demonstrar o uso de tecnologias web estáticas (HTML, CSS e JS) para promover cultura e gastronomia.

Autor: Leonardo Schiavinatto
Ano: 2025

✅ Licença

Uso educacional e demonstrativo.
Código-fonte aberto para consulta e replicação acadêmica.