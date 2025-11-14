// ===== Base de dados e favoritos =====
const KEY = "receitas_v3";
const FAV_KEY = "receitas_favs_v1";

async function carregarBase() {
  const ls = localStorage.getItem(KEY);
  if (ls) return JSON.parse(ls);
  const res = await fetch("data/receitas.json");
  const json = await res.json();
  localStorage.setItem(KEY, JSON.stringify(json));
  return json;
}

function salvarBase(base) {
  // salva no localStorage normalmente
  localStorage.setItem(KEY, JSON.stringify(base));

  // cria o elemento de notificação (toast)
  const msg = document.createElement("div");
  msg.textContent = "✅ Receita salva com sucesso!";
  msg.style.position = "fixed";
  msg.style.bottom = "20px";
  msg.style.right = "20px";
  msg.style.background = "#14503b";
  msg.style.color = "white";
  msg.style.padding = "10px 16px";
  msg.style.borderRadius = "8px";
  msg.style.fontWeight = "bold";
  msg.style.boxShadow = "0 3px 10px rgba(0,0,0,.3)";
  msg.style.zIndex = "999";
  msg.style.transition = "opacity 0.5s";
  msg.style.opacity = "1";

  document.body.appendChild(msg);

  // some após 2,5 segundos
  setTimeout(() => {
    msg.style.opacity = "0";
    setTimeout(() => msg.remove(), 500);
  }, 2500);
}

function loadFavs(){
  try { return new Set(JSON.parse(localStorage.getItem(FAV_KEY) || "[]")); }
  catch { return new Set(); }
}
function saveFavs(fset){
  localStorage.setItem(FAV_KEY, JSON.stringify(Array.from(fset)));
}
function uid(){ return Math.random().toString(36).slice(2,10); }

// ===== Dialog de leitura do preparo =====
const dlgRead = document.getElementById("dlgRead");
const readTitle = document.getElementById("read-title");
const readText  = document.getElementById("read-text");
const btnCloseRead = document.getElementById("btn-close-read");
const btnCopyRead  = document.getElementById("btn-copy-read");

if (btnCloseRead && dlgRead) {
  btnCloseRead.onclick = () => dlgRead.close();
}
if (btnCopyRead && readText) {
  btnCopyRead.onclick = () => {
    navigator.clipboard
      .writeText(readText.textContent || "")
      .then(() => alert("Preparo copiado!"));
  };
}

function abrirLeitura(r){
  if (!dlgRead || !readTitle || !readText) return;
  readTitle.textContent = r.nome;
  readText.textContent = r.preparo || "";
  dlgRead.showModal();
}

// ===== Renderização de cards =====
function criarCard(r, favs){
  const el = document.createElement("article");
  el.className = "card";
  const isFav = favs.has(r.id);

  // Monta o card básico (sem o preparo ainda)
  el.innerHTML = `
    <h3>${r.nome}</h3>
    <div class="meta">${r.regiao} • ${r.categoria || "—"}</div>
    <div class="tags">
      ${r.ingredientes.slice(0,6).map(i=>`<span class="tag">${i}</span>`).join("")}
    </div>
  `;

  // --- BLOCO DO PREPARO (resumo + botão "ver completo") ---
  const fullText = r.preparo || "";
  const MAX = 220;

  const p = document.createElement("p");

  if (fullText.length > MAX) {
    p.textContent = fullText.slice(0, MAX) + "…";

    const btnMore = document.createElement("button");
    btnMore.type = "button";
    btnMore.textContent = "Ver preparo completo";
    btnMore.className = "btn-more-preparo";

    btnMore.addEventListener("click", () => {
      abrirLeitura(r);
    });

    el.appendChild(p);
    el.appendChild(btnMore);

  } else {
    p.textContent = fullText;
    el.appendChild(p);
  }

  // --- MENU DE AÇÕES (favoritos e editar) ---
  const menu = document.createElement("menu");
  menu.innerHTML = `
      <div class="left-actions">
        <button class="fav-toggle ${isFav?"active":""}" data-id="${r.id}" title="Salvar">
          ${isFav ? "★ Salvo" : "☆ Salvar"}
        </button>
      </div>
      <button data-id="${r.id}" class="edit">Editar</button>
  `;
  el.append(menu);

  return el;
}

function renderLista(base, favs, {q="", regiao="", onlyFavs=false}={}){
  const lista = document.getElementById("lista");
  if (!lista) return;
  lista.innerHTML = "";
  base
    .filter(r => !regiao || r.regiao === regiao)
    .filter(r => {
      if (!q) return true;
      const t = q.toLowerCase();
      return r.nome.toLowerCase().includes(t)
        || (r.categoria||"").toLowerCase().includes(t)
        || r.ingredientes.join(" ").toLowerCase().includes(t);
    })
    .filter(r => !onlyFavs || favs.has(r.id))
    .forEach(r => lista.appendChild(criarCard(r, favs)));
}

function renderRegiao(base, favs, regiao){
  const grid = document.getElementById("grid-regiao");
  const heading = document.getElementById("region-heading");
  if (!grid || !heading) return;
  grid.innerHTML = "";
  heading.textContent = regiao ? `Receitas — ${regiao}` : "Selecione uma região";
  if (!regiao) return;
  base.filter(r => r.regiao === regiao)
      .forEach(r => grid.appendChild(criarCard(r, favs)));
}

// ===== Navegação (SPA simples por hash) =====
function showPage(id){
  document.querySelectorAll(".page").forEach(s => s.hidden = true);
  const el = document.getElementById(id);
  if (el) el.hidden = false;
  // destacar nav
  document.querySelectorAll('[data-nav]').forEach(a=>{
    const href = a.getAttribute("href") || "";
    a.classList.toggle("active", href.replace("#","") === id);
  });
}
function currentPageFromHash(){
  const h = (location.hash || "#inicio").replace("#","");
  const known = ["inicio","receitas","regioes","historias","sobre"];
  return known.includes(h) ? h : "inicio";
}

// ===== App principal =====
(function main(){
  let base, favs = loadFavs();
  let onlyFavs = false;

  // Carregar base e render inicial de Receitas
  carregarBase().then(json => {
    base = json;
    if (currentPageFromHash() === "receitas")
      renderLista(base, favs);
    showPage(currentPageFromHash());
  });

  // Elementos comuns
  const lista = document.getElementById("lista");
  const form = document.getElementById("form");
  const btnAdd = document.getElementById("btn-add");
  const btnClose = document.getElementById("btn-close");
  const btnDel = document.getElementById("btn-del");
  const regiaoSelect = document.getElementById("regiao");
  const q = document.getElementById("q");
  const btnSearch = document.getElementById("btn-search");
  const btnFavs = document.getElementById("btn-favs");
  const btnProfile = document.getElementById("btn-profile");
  const dlgProfile = document.getElementById("dlgProfile");
  const stats = document.getElementById("stats");

  function abrirDialogo(t){
    document.getElementById("dlg-titulo").textContent = t;
    document.getElementById("dlg").showModal();
  }
  function fecharDialogo(){ document.getElementById("dlg").close(); }
  function resetForm(){
    form.reset();
    form.id.value="";
    btnDel.hidden = true;
  }
  function preencherForm(r){
    form.id.value=r.id;
    form.nome.value=r.nome;
    form.regiao.value=r.regiao;
    form.categoria.value=r.categoria||"";
    form.ingredientes.value=r.ingredientes.join("\n");
    form.preparo.value=r.preparo;
    btnDel.hidden=false;
  }
  function findById(id){ return base.find(r=>r.id===id); }

  // Navegação por hash
  window.addEventListener("hashchange", ()=>{
    const page = currentPageFromHash();
    showPage(page);
    if (page === "receitas")
      renderLista(base, favs, {q: q?.value || "", regiao: regiaoSelect?.value || "", onlyFavs});
  });

  // Toolbar Receitas
  if (btnAdd)
    btnAdd.addEventListener("click", ()=>{
      resetForm();
      abrirDialogo("Nova receita");
    });

  if (btnClose)
    btnClose.addEventListener("click", fecharDialogo);

  if (q)
    q.addEventListener("input", ()=>{
      renderLista(base, favs, {q: q.value, regiao: regiaoSelect.value, onlyFavs});
    });

  if (regiaoSelect)
    regiaoSelect.addEventListener("change", ()=>{
      renderLista(base, favs, {q: q.value, regiao: regiaoSelect.value, onlyFavs});
    });

  if (btnSearch)
    btnSearch.addEventListener("click", ()=>{
      q?.focus();
      q?.select();
      renderLista(base, favs, {q: q.value, regiao: regiaoSelect.value, onlyFavs});
    });

  // Filtro: Somente favoritos (global)
  function updateFavFilterUI(){
    if (!btnFavs) return;
    btnFavs.style.color = onlyFavs ? "var(--gold)" : "var(--offwhite)";
  }

  if (btnFavs)
    btnFavs.addEventListener("click", ()=>{
      onlyFavs = !onlyFavs;
      updateFavFilterUI();
      if (currentPageFromHash() === "receitas")
        renderLista(base, favs, {q: q?.value || "", regiao: regiaoSelect?.value || "", onlyFavs});
      if (currentPageFromHash() === "regioes") {
        const cur = document.querySelector(".region-btn.active")?.dataset.region || "";
        renderRegiao(base, favs, cur);
      }
    });

  window.addEventListener("keydown", (e)=>{
    if (e.key.toLowerCase() === "f"){
      onlyFavs = !onlyFavs;
      updateFavFilterUI();
      if (currentPageFromHash()==="receitas")
        renderLista(base, favs, {q:q?.value||"", regiao:regiaoSelect?.value||"", onlyFavs});
    }
  });

  // Perfil local
  if (btnProfile)
    btnProfile.addEventListener("click", ()=>{
      stats.textContent = `Receitas: ${base?.length||0} • Salvos: ${favs.size}`;
      dlgProfile.showModal();
    });

  document.getElementById("btn-close-profile")?.addEventListener("click", ()=>dlgProfile.close());

  document.getElementById("btn-clear")?.addEventListener("click", ()=>{
    localStorage.removeItem(KEY);
    localStorage.removeItem(FAV_KEY);
    favs = new Set();
    carregarBase().then(json => {
      base = json;
      if (currentPageFromHash()==="receitas")
        renderLista(base, favs);
      if (currentPageFromHash()==="regioes")
        renderRegiao(base, favs, "");
    });
    dlgProfile.close();
  });

  // Lista: editar e favoritar (Receitas e Regiões usam o mesmo handler via event delegation)
  document.body.addEventListener("click", (e)=>{
    const favBtn = e.target.closest("button.fav-toggle");
    if (favBtn){
      const id = favBtn.dataset.id;
      if (favs.has(id)) favs.delete(id); else favs.add(id);
      saveFavs(favs);
      if (currentPageFromHash() === "receitas")
        renderLista(base, favs, {q: q?.value || "", regiao: regiaoSelect?.value || "", onlyFavs});
      if (currentPageFromHash() === "regioes") {
        const cur = document.querySelector(".region-btn.active")?.dataset.region || "";
        renderRegiao(base, favs, cur);
      }
      return;
    }

    const editBtn = e.target.closest("button.edit");
    if (editBtn){
      const r = findById(editBtn.dataset.id);
      if (!r) return;
      preencherForm(r);
      abrirDialogo("Editar receita");
    }
  });

  // Salvar/Excluir no diálogo
  if (form)
    form.addEventListener("submit", (e)=>{
      e.preventDefault();
      const dados = {
        id: form.id.value || uid(),
        nome: form.nome.value.trim(),
        regiao: form.regiao.value,
        categoria: form.categoria.value.trim(),
        ingredientes: form.ingredientes.value.split(/\n+/).map(s=>s.trim()).filter(Boolean),
        preparo: form.preparo.value.trim()
      };
      const i = base.findIndex(r=>r.id===dados.id);
      if (i>=0) base[i]=dados; else base.unshift(dados);
      salvarBase(base);
      if (currentPageFromHash() === "receitas")
        renderLista(base, favs, {q: q?.value || "", regiao: regiaoSelect?.value || "", onlyFavs});
      if (currentPageFromHash() === "regioes") {
        const cur = document.querySelector(".region-btn.active")?.dataset.region || "";
        renderRegiao(base, favs, cur);
      }
      fecharDialogo();
    });

  if (btnDel)
    btnDel.addEventListener("click", ()=>{
      const id = form.id.value;
      if (!id) return;
      base = base.filter(r => r.id !== id);
      salvarBase(base);
      if (favs.has(id)){
        favs.delete(id);
        saveFavs(favs);
      }
      if (currentPageFromHash() === "receitas")
        renderLista(base, favs, {q: q?.value || "", regiao: regiaoSelect?.value || "", onlyFavs});
      if (currentPageFromHash() === "regioes") {
        const cur = document.querySelector(".region-btn.active")?.dataset.region || "";
        renderRegiao(base, favs, cur);
      }
      fecharDialogo();
    });

  // Página Regiões: selecionar região
  document.querySelectorAll(".region-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      document.querySelectorAll(".region-btn").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      renderRegiao(base, favs, btn.dataset.region);
    });
  });

  // Links com data-nav rodam via hash (rotear)
  document.querySelectorAll('[data-nav]').forEach(a=>{
    a.addEventListener("click",(e)=>{
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      e.preventDefault();
      history.pushState(null,"",href);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
      window.scrollTo({top:0,behavior:"instant"});
    });
  });

  // Estado inicial
  updateFavFilterUI();
  showPage(currentPageFromHash());
})();
