const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
    nav.classList.toggle("is-open", !isOpen);
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
  }));
}
const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

/* Agenda: filtros client-side para os cards demonstrativos. */
const agendaFilters = document.querySelectorAll("[data-agenda-filter]");
const agendaCards = document.querySelectorAll(".agenda-card");
const agendaCount = document.querySelector("#agenda-count");
agendaFilters.forEach(button => button.addEventListener("click", () => {
  agendaFilters.forEach(b => b.classList.toggle("active", b === button));
  const filter = button.dataset.agendaFilter;
  let count = 0;
  agendaCards.forEach(card => {
    const show = filter === "todos" || card.dataset.category === filter;
    card.hidden = !show;
    if (show) count++;
  });
  if (agendaCount) agendaCount.textContent = `${count} ${count === 1 ? "ideia" : "ideias"}`;
}));

/* Indicações: filtro de categoria + busca textual. */
let activeRecommendation = "todos";
const recSearch = document.querySelector("#recommendation-search");
const recCards = [...document.querySelectorAll(".recommendation-card")];
const emptyResults = document.querySelector("#empty-results");
function filterRecommendations() {
  const query = (recSearch?.value || "").trim().toLocaleLowerCase("pt-BR");
  let visible = 0;
  recCards.forEach(card => {
    const categoryMatch = activeRecommendation === "todos" || card.dataset.category === activeRecommendation;
    const searchable = `${card.dataset.search || ""} ${card.textContent || ""}`.toLocaleLowerCase("pt-BR");
    const textMatch = !query || searchable.includes(query);
    const show = categoryMatch && textMatch;
    card.hidden = !show;
    if (show) visible++;
  });
  if (emptyResults) emptyResults.hidden = visible !== 0;
}
document.querySelectorAll("[data-rec-filter]").forEach(button => button.addEventListener("click", () => {
  activeRecommendation = button.dataset.recFilter;
  document.querySelectorAll("[data-rec-filter]").forEach(b => b.classList.toggle("active", b === button));
  filterRecommendations();
}));
if (recSearch) recSearch.addEventListener("input", filterRecommendations);

/* Modal de login/cadastro: demonstração de interface, sem autenticação real. */
const loginModal = document.querySelector("#login-modal");
const closeLogin = document.querySelector(".modal-close");
const loginForm = document.querySelector("#login-demo-form");
const loginTitle = document.querySelector("#login-title");
const loginSubmit = document.querySelector("#login-submit");
const loginPassword = document.querySelector("#login-password");
const loginNote = document.querySelector("#login-demo-note");
let loginMode = "login";
function openModal() {
  if (!loginModal) return;
  loginModal.hidden = false;
  document.body.style.overflow = "hidden";
  closeLogin?.focus();
}
function closeModal() {
  if (!loginModal) return;
  loginModal.hidden = true;
  document.body.style.overflow = "";
}
document.querySelectorAll("[data-open-login]").forEach(button => button.addEventListener("click", openModal));
closeLogin?.addEventListener("click", closeModal);
loginModal?.addEventListener("click", event => { if (event.target === loginModal) closeModal(); });
document.addEventListener("keydown", event => { if (event.key === "Escape" && loginModal && !loginModal.hidden) closeModal(); });
document.querySelectorAll("[data-login-tab]").forEach(button => button.addEventListener("click", () => {
  loginMode = button.dataset.loginTab;
  document.querySelectorAll("[data-login-tab]").forEach(tab => {
    const active = tab === button;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  loginTitle.textContent = loginMode === "login" ? "Um espaço só seu." : "Vamos criar seu espaço.";
  loginSubmit.innerHTML = loginMode === "login" ? 'Entrar na comunidade <span>↗</span>' : 'Criar minha conta <span>↗</span>';
  loginPassword.autocomplete = loginMode === "login" ? "current-password" : "new-password";
  loginNote.textContent = loginMode === "login"
    ? "Prévia visual: o acesso ainda não está conectado a um sistema real de contas."
    : "Prévia visual: o cadastro ainda não cria uma conta real. A integração de autenticação precisa ser configurada.";
}));
loginForm?.addEventListener("submit", event => {
  event.preventDefault();
  if (!loginForm.reportValidity()) return;
  loginNote.textContent = loginMode === "login"
    ? "Esta é apenas uma demonstração visual. Nenhum login foi realizado e nenhuma informação foi enviada."
    : "Esta é apenas uma demonstração visual. Nenhuma conta foi criada e nenhuma informação foi enviada.";
});
