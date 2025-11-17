// ===== Chaves de armazenamento =====
const KEY = "receitas_v3";
const FAV_KEY = "receitas_favs_v1";
const THEME_KEY = "brasil_a_mesa_theme";

/* ========================================================
   TEMA
======================================================== */

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
}

/* ========================================================
   FUNÇÕES DE STORAGE
======================================================== */

async function carregarBase() {
  const ls = localStorage.getItem(KEY);
  if (ls) return JSON.parse(ls);

  const res = await fetch("data/receitas.json");
  const json = await res.json();
  localStorage.setItem(KEY, JSON.stringify(json));
  return json;
}

function salvarBase(base) {
  localStorage.setItem(KEY, JSON.stringify(base));
}

function loadFavs() {
  try {
    return new Set(JSON.parse(localStorage.getItem(FAV_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

function saveFavs(fset) {
  localStorage.setItem(FAV_KEY, JSON.stringify(Array.from(fset)));
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

/* ========================================================
   TOAST GLOBAL
======================================================== */

function showToast(msg) {
  const el = document.createElement("div");
  el.textContent = msg;

  el.style.position = "fixed";
  el.style.bottom = "20px";
  el.style.right = "20px";
  el.style.background = "#14503b";
  el.style.color = "white";
  el.style.padding = "10px 16px";
  el.style.borderRadius = "8px";
  el.style.fontWeight = "bold";
  el.style.boxShadow = "0 3px 10px rgba(0,0,0,.3)";
  el.style.zIndex = "999";
  el.style.opacity = "1";
  el.style.transition = "opacity 0.5s, transform 0.5s";
  el.style.transform = "translateY(0)";

  document.body.appendChild(el);

  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateY(10px)";
    setTimeout(() => el.remove(), 500);
  }, 2200);
}

/* ========================================================
   DIALOG DE LEITURA
======================================================== */

const dlgRead = document.getElementById("dlgRead");
const readTitle = document.getElementById("read-title");
const readText = document.getElementById("read-text");
const btnCloseRead = document.getElementById("btn-close-read");
const btnCopyRead = document.getElementById("btn-copy-read");

if (btnCloseRead) btnCloseRead.onclick = () => dlgRead.close();

if (btnCopyRead) {
  btnCopyRead.onclick = () => {
    navigator.clipboard.writeText(readText.textContent || "").then(() => {
      showToast("Preparo copiado!");
    });
  };
}

function abrirLeitura(r) {
  readTitle.textContent = r.nome;
  readText.textContent = r.preparo || "";
  dlgRead.showModal();
}

/* ========================================================
   CARDS
======================================================== */

function criarCard(r, favs) {
  const el = document.createElement("article");
  el.className = "card";
  const isFav = favs.has(r.id);

  el.innerHTML = `
    <h3>${r.nome}</h3>
    <div class="meta">${r.regiao} • ${r.categoria || "—"}</div>
    <div class="tags">
      ${r.ingredientes
        .slice(0, 6)
        .map((i) => `<span class="tag">${i}</span>`)
        .join("")}
    </div>
  `;

  const fullText = r.preparo || "";
  const MAX = 220;
  const p = document.createElement("p");

  if (fullText.length > MAX) {
    p.textContent = fullText.slice(0, MAX) + "…";

    const btnMore = document.createElement("button");
    btnMore.type = "button";
    btnMore.textContent = "Ver preparo completo";
    btnMore.className = "btn-more-preparo";

    btnMore.addEventListener("click", () => abrirLeitura(r));

    el.appendChild(p);
    el.appendChild(btnMore);
  } else {
    p.textContent = fullText;
    el.appendChild(p);
  }

  const menu = document.createElement("menu");
  menu.innerHTML = `
    <div class="left-actions">
      <button class="fav-toggle ${isFav ? "active" : ""}" data-id="${
    r.id
  }" title="Salvar">
        ${isFav ? "★ Salvo" : "☆ Salvar"}
      </button>
    </div>
    <button data-id="${r.id}" class="edit">Editar</button>
  `;
  el.append(menu);

  return el;
}

/* ========================================================
   RENDERIZAÇÃO
======================================================== */

function renderLista(
  base,
  favs,
  { q = "", regiao = "", onlyFavs = false } = {}
) {
  const lista = document.getElementById("lista");
  if (!lista) return;

  lista.innerHTML = "";

  base
    .filter((r) => !regiao || r.regiao === regiao)
    .filter((r) => {
      if (!q) return true;
      const t = q.toLowerCase();
      return (
        r.nome.toLowerCase().includes(t) ||
        (r.categoria || "").toLowerCase().includes(t) ||
        r.ingredientes.join(" ").toLowerCase().includes(t)
      );
    })
    .filter((r) => !onlyFavs || favs.has(r.id))
    .forEach((r) => lista.appendChild(criarCard(r, favs)));
}

function renderRegiao(base, favs, regiao) {
  const grid = document.getElementById("grid-regiao");
  const heading = document.getElementById("region-heading");
  if (!grid || !heading) return;

  grid.innerHTML = "";
  heading.textContent = regiao
    ? `Receitas — ${regiao}`
    : "Selecione uma região";

  if (!regiao) return;

  base
    .filter((r) => r.regiao === regiao)
    .forEach((r) => grid.appendChild(criarCard(r, favs)));
}

/* ========================================================
   NAVEGAÇÃO SPA
======================================================== */

function showPage(id) {
  document.querySelectorAll(".page").forEach((s) => (s.hidden = true));
  const el = document.getElementById(id);
  if (el) el.hidden = false;

  document.querySelectorAll("[data-nav]").forEach((a) => {
    const href = a.getAttribute("href") || "";
    a.classList.toggle("active", href.replace("#", "") === id);
  });
}

function currentPageFromHash() {
  const h = (location.hash || "#inicio").replace("#", "");
  const known = ["inicio", "receitas", "regioes", "historias", "sobre"];
  return known.includes(h) ? h : "inicio";
}

/* ========================================================
   APP PRINCIPAL
======================================================== */

(function main() {
  let base;
  let favs = loadFavs();
  let onlyFavs = false;

  // Tema inicial
  const savedTheme = localStorage.getItem(THEME_KEY) || "dark";
  applyTheme(savedTheme);

  // Elementos principais
  const form = document.getElementById("form");
  const fieldId = form.elements.id; // hidden id
  const btnAdd = document.getElementById("btn-add");
  const btnClose = document.getElementById("btn-close");
  const btnDel = document.getElementById("btn-del");
  const regiaoSelect = document.getElementById("regiao");
  const q = document.getElementById("q");
  const btnSearch = document.getElementById("btn-search");
  const btnFavs = document.getElementById("btn-favs");
  const btnTheme = document.getElementById("btn-theme");
  const btnProfile = document.getElementById("btn-profile");
  const dlgProfile = document.getElementById("dlgProfile");
  const stats = document.getElementById("stats");

  function updateThemeButton(theme) {
    if (!btnTheme) return;
    if (theme === "dark") {
      btnTheme.textContent = "☀️";
      btnTheme.title = "Usar tema claro";
    } else {
      btnTheme.textContent = "🌙";
      btnTheme.title = "Usar tema escuro";
    }
    btnTheme.setAttribute("aria-label", btnTheme.title);
  }

  updateThemeButton(savedTheme);

  function abrirDialogo(t) {
    document.getElementById("dlg-titulo").textContent = t;
    document.getElementById("dlg").showModal();
  }

  function fecharDialogo() {
    document.getElementById("dlg").close();
  }

  function resetForm() {
    form.reset();
    fieldId.value = "";
    btnDel.hidden = true;
  }

  function preencherForm(r) {
    fieldId.value = r.id;
    form.nome.value = r.nome;
    form.regiao.value = r.regiao;
    form.categoria.value = r.categoria || "";
    form.ingredientes.value = r.ingredientes.join("\n");
    form.preparo.value = r.preparo;
    btnDel.hidden = false;
  }

  function findById(id) {
    return base.find((r) => r.id === id);
  }

  // Carregar base e página inicial
  carregarBase().then((json) => {
    base = json;

    if (currentPageFromHash() === "receitas") {
      renderLista(base, favs);
    }

    showPage(currentPageFromHash());
  });

  // Navegação por hash
  window.addEventListener("hashchange", () => {
    const page = currentPageFromHash();
    showPage(page);

    if (page === "receitas") {
      renderLista(base, favs, {
        q: q?.value || "",
        regiao: regiaoSelect?.value || "",
        onlyFavs,
      });
    }
  });

  // Toolbar Receitas
  if (btnAdd)
    btnAdd.addEventListener("click", () => {
      resetForm();
      abrirDialogo("Nova receita");
    });

  if (btnClose) btnClose.addEventListener("click", fecharDialogo);

  if (q)
    q.addEventListener("input", () => {
      renderLista(base, favs, {
        q: q.value,
        regiao: regiaoSelect.value,
        onlyFavs,
      });
    });

  if (regiaoSelect)
    regiaoSelect.addEventListener("change", () => {
      renderLista(base, favs, {
        q: q.value,
        regiao: regiaoSelect.value,
        onlyFavs,
      });
    });

  if (btnSearch)
    btnSearch.addEventListener("click", () => {
      q?.focus();
      q?.select();
      renderLista(base, favs, {
        q: q.value,
        regiao: regiaoSelect.value,
        onlyFavs,
      });
    });

  function updateFavFilterUI() {
    if (!btnFavs) return;
    btnFavs.style.color = onlyFavs ? "var(--gold)" : "var(--offwhite)";
  }

  if (btnFavs)
    btnFavs.addEventListener("click", () => {
      onlyFavs = !onlyFavs;
      updateFavFilterUI();

      if (currentPageFromHash() === "receitas")
        renderLista(base, favs, {
          q: q?.value || "",
          regiao: regiaoSelect?.value || "",
          onlyFavs,
        });

      if (currentPageFromHash() === "regioes") {
        const cur =
          document.querySelector(".region-btn.active")?.dataset.region || "";
        renderRegiao(base, favs, cur);
      }
    });

  // Botão de tema claro/escuro
  if (btnTheme) {
    btnTheme.addEventListener("click", () => {
      const current =
        document.documentElement.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      updateThemeButton(next);
    });
  }

  // Atalho teclado: F para alternar favoritos (fora de inputs)
  window.addEventListener("keydown", (e) => {
    const tag = e.target.tagName;

    if (
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      e.target.isContentEditable
    ) {
      return;
    }

    if (e.key.toLowerCase() === "f") {
      onlyFavs = !onlyFavs;
      updateFavFilterUI();

      if (currentPageFromHash() === "receitas")
        renderLista(base, favs, {
          q: q?.value || "",
          regiao: regiaoSelect?.value || "",
          onlyFavs,
        });
    }
  });

  // Perfil local
  if (btnProfile)
    btnProfile.addEventListener("click", () => {
      stats.textContent = `Receitas: ${base?.length || 0} • Salvos: ${
        favs.size
      }`;
      dlgProfile.showModal();
    });

  document
    .getElementById("btn-close-profile")
    ?.addEventListener("click", () => dlgProfile.close());

  document.getElementById("btn-clear")?.addEventListener("click", () => {
    localStorage.removeItem(KEY);
    localStorage.removeItem(FAV_KEY);
    favs = new Set();

    carregarBase().then((json) => {
      base = json;

      if (currentPageFromHash() === "receitas") renderLista(base, favs);
      if (currentPageFromHash() === "regioes") renderRegiao(base, favs, "");
    });

    dlgProfile.close();
  });

  // Clique em favoritar / editar
  document.body.addEventListener("click", (e) => {
    const favBtn = e.target.closest("button.fav-toggle");

    if (favBtn) {
      const id = favBtn.dataset.id;

      if (favs.has(id)) favs.delete(id);
      else favs.add(id);

      saveFavs(favs);

      if (currentPageFromHash() === "receitas")
        renderLista(base, favs, {
          q: q?.value || "",
          regiao: regiaoSelect?.value || "",
          onlyFavs,
        });

      if (currentPageFromHash() === "regioes") {
        const cur =
          document.querySelector(".region-btn.active")?.dataset.region || "";
        renderRegiao(base, favs, cur);
      }

      return;
    }

    const editBtn = e.target.closest("button.edit");

    if (editBtn) {
      const r = findById(editBtn.dataset.id);
      if (!r) return;

      preencherForm(r);
      abrirDialogo("Editar receita");
      return;
    }
  });

  // Submit do formulário
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();

    const id = fieldId.value || uid();
    const rec = findById(id);

    const dados = {
      id,
      nome: form.nome.value.trim(),
      regiao: form.regiao.value.trim(),
      categoria: form.categoria.value.trim(),
      ingredientes: form.ingredientes.value
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      preparo: form.preparo.value.trim(),
    };

    if (rec) {
      const idx = base.findIndex((r) => r.id === id);
      base[idx] = dados;
    } else {
      base.push(dados);
    }

    salvarBase(base);
    showToast("Receita salva com sucesso!");

    fecharDialogo();

    if (currentPageFromHash() === "receitas")
      renderLista(base, favs, {
        q: q?.value || "",
        regiao: regiaoSelect?.value || "",
        onlyFavs,
      });
  });

  // Excluir receita
  btnDel?.addEventListener("click", () => {
    const id = fieldId.value;
    base = base.filter((r) => r.id !== id);
    favs.delete(id);

    salvarBase(base);
    saveFavs(favs);

    showToast("Receita excluída!");

    fecharDialogo();

    if (currentPageFromHash() === "receitas")
      renderLista(base, favs, {
        q: q?.value || "",
        regiao: regiaoSelect?.value || "",
        onlyFavs,
      });
  });

  // Página Regiões — clique dos botões
  document.querySelectorAll(".region-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".region-btn")
        .forEach((b) => b.classList.remove("active"));

      btn.classList.add("active");

      renderRegiao(base, favs, btn.dataset.region);
    });
  });
})();
