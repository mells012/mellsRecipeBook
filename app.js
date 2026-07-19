// ============================================================
// Mell's Recipe Book · lógica
// ============================================================

const STORE = {
    filters: "mrb.filters",
    checked: "mrb.checked"
};

const state = {
    filters: new Set(JSON.parse(localStorage.getItem(STORE.filters) || "[]")),
    checked: new Set(JSON.parse(localStorage.getItem(STORE.checked) || "[]"))
};

const $ = (sel) => document.querySelector(sel);

const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function save() {
    localStorage.setItem(STORE.filters, JSON.stringify([...state.filters]));
    localStorage.setItem(STORE.checked, JSON.stringify([...state.checked]));
}

const categories = () => [...new Set(RECIPES.map((r) => r.category))];

// Recetas visibles según filtros (sin filtros = todas)
function visibleRecipes() {
    if (state.filters.size === 0) return RECIPES;
    return RECIPES.filter((r) => state.filters.has(r.category));
}

// Compila los ingredientes de las recetas visibles en una sola lista
function compileIngredients() {
    const map = new Map();
    for (const recipe of visibleRecipes()) {
        for (const ing of recipe.ingredients) {
            if (!map.has(ing.name)) {
                map.set(ing.name, { name: ing.name, notes: [], recipes: [] });
            }
            const entry = map.get(ing.name);
            if (ing.note) entry.notes.push(ing.note);
            if (!entry.recipes.some((r) => r.id === recipe.id)) {
                entry.recipes.push(recipe);
            }
        }
    }
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, "es"));
}

// ============ RENDER ============

function renderMeta() {
    const allNames = new Set(RECIPES.flatMap((r) => r.ingredients.map((i) => i.name)));
    $("#meta-recipes").textContent = RECIPES.length;
    $("#meta-categories").textContent = categories().length;
    $("#meta-ingredients").textContent = allNames.size;
}

function renderRecipes() {
    $("#recipes-grid").innerHTML = RECIPES.map((r) => `
        <article class="recipe-card" data-recipe="${r.id}">
            <div class="card-emoji">${r.emoji}</div>
            <span class="card-cat">${esc(r.category)}</span>
            <h3>${esc(r.name)}</h3>
            <p class="card-sub">${esc(r.subtitle)}</p>
            <div class="card-stats">
                <span><b>${r.ingredients.length}</b> ingredientes</span>
                <span class="card-link">Ver receta →</span>
            </div>
        </article>`
    ).join("");
}

function renderFilters() {
    $("#filter-chips").innerHTML = categories().map((cat) => {
        const count = RECIPES.filter((r) => r.category === cat).length;
        const on = state.filters.has(cat);
        return `
        <button class="chip ${on ? "on" : ""}" data-cat="${esc(cat)}">
            ${on ? "✓ " : ""}${esc(cat)} <span class="chip-count">(${count})</span>
        </button>`;
    }).join("");
}

function renderShoppingList() {
    const items = compileIngredients();
    const body = $("#shopping-body");

    if (items.length === 0) {
        body.innerHTML = `<tr class="empty-row"><td colspan="3">No hay ingredientes para mostrar.</td></tr>`;
        $("#shopping-progress").textContent = "—";
        return;
    }

    body.innerHTML = items.map((item) => {
        const done = state.checked.has(item.name);
        const note = item.notes.length
            ? `<span class="ing-note">${esc([...new Set(item.notes)].join(" · "))}</span>`
            : "";
        const badges = item.recipes.map((r) =>
            `<button class="badge" data-recipe="${r.id}" title="Ver receta">${r.emoji} ${esc(r.name)}</button>`
        ).join("");
        return `
        <tr class="${done ? "done" : ""}">
            <td class="cell-check">
                <input type="checkbox" data-ing="${esc(item.name)}" ${done ? "checked" : ""}
                       aria-label="Comprado: ${esc(item.name)}">
            </td>
            <td class="cell-name">${esc(item.name)}${note}</td>
            <td><div class="badges">${badges}</div></td>
        </tr>`;
    }).join("");

    const bought = items.filter((i) => state.checked.has(i.name)).length;
    $("#shopping-progress").innerHTML =
        `<b>${bought}</b> de <b>${items.length}</b> ingredientes comprados`;
}

// ============ MODAL ============

function openRecipe(id) {
    const r = RECIPES.find((x) => x.id === id);
    if (!r) return;

    $("#modal-body").innerHTML = `
        <span class="m-cat">${esc(r.category)}</span>
        <h2 class="m-title">${r.emoji} ${esc(r.name)}</h2>
        <p class="m-sub">${esc(r.subtitle)}</p>
        <p class="m-intro">${esc(r.intro)}</p>
        <div class="m-section">
            <h3 class="m-h">Ingredientes</h3>
            <ul class="m-ingredients">
                ${r.ingredients.map((i) =>
                    `<li>${esc(i.name)}${i.note ? ` <span class="ing-note">(${esc(i.note)})</span>` : ""}</li>`
                ).join("")}
            </ul>
        </div>
        <div class="m-section">
            <h3 class="m-h">Preparación</h3>
            <ol class="m-steps">
                ${r.steps.map((s) => `<li>${esc(s)}</li>`).join("")}
            </ol>
        </div>`;

    $("#recipe-modal").classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    $("#recipe-modal").classList.remove("show");
    document.body.style.overflow = "";
}

// ============ TABS ============

function switchTab(tab) {
    document.querySelectorAll(".tab-btn").forEach((b) =>
        b.classList.toggle("active", b.dataset.tab === tab));
    document.querySelectorAll(".tab-panel").forEach((p) =>
        p.classList.toggle("active", p.id === `${tab}-tab`));
    history.replaceState(null, "", tab === "shopping" ? "#compras" : "#recetario");
}

// ============ EVENTOS ============

function setupEvents() {
    // Tabs
    document.querySelectorAll(".tab-btn").forEach((btn) => {
        btn.addEventListener("click", () => switchTab(btn.dataset.tab));
    });

    // Abrir receta (cards del board)
    $("#recipes-grid").addEventListener("click", (e) => {
        const card = e.target.closest("[data-recipe]");
        if (card) openRecipe(card.dataset.recipe);
    });

    // Filtros multiselección
    $("#filter-chips").addEventListener("click", (e) => {
        const chip = e.target.closest("[data-cat]");
        if (!chip) return;
        const cat = chip.dataset.cat;
        state.filters.has(cat) ? state.filters.delete(cat) : state.filters.add(cat);
        save();
        renderFilters();
        renderShoppingList();
    });

    // Checklist + etiquetas de receta dentro de la tabla
    $("#shopping-body").addEventListener("click", (e) => {
        const badge = e.target.closest(".badge");
        if (badge) { openRecipe(badge.dataset.recipe); return; }
    });

    $("#shopping-body").addEventListener("change", (e) => {
        const box = e.target.closest("input[data-ing]");
        if (!box) return;
        const name = box.dataset.ing;
        box.checked ? state.checked.add(name) : state.checked.delete(name);
        save();
        renderShoppingList();
    });

    // Desmarcar todo
    $("#clear-checked").addEventListener("click", () => {
        state.checked.clear();
        save();
        renderShoppingList();
    });

    // Modal
    $(".modal-close").addEventListener("click", closeModal);
    $("#recipe-modal").addEventListener("click", (e) => {
        if (e.target.id === "recipe-modal") closeModal();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
    });
}

// ============ INIT ============

renderMeta();
renderRecipes();
renderFilters();
renderShoppingList();
setupEvents();
if (location.hash === "#compras") switchTab("shopping");
