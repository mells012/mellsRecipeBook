// ============================================================
// Mell's Recipe Book · lógica
// ============================================================

const STORE = {
    filters: "mrb.filters",
    checked: "mrb.checked"
};

const NUTRIENT_ORDER = [...MACROS, ...MICROS];

const state = {
    filters: new Set(JSON.parse(localStorage.getItem(STORE.filters) || "[]")),
    checked: new Set(JSON.parse(localStorage.getItem(STORE.checked) || "[]"))
};

// Descarta filtros guardados que ya no existan (p. ej. de versiones anteriores)
for (const f of [...state.filters]) {
    if (!NUTRIENT_ORDER.includes(f)) state.filters.delete(f);
}

const $ = (sel) => document.querySelector(sel);

const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function save() {
    localStorage.setItem(STORE.filters, JSON.stringify([...state.filters]));
    localStorage.setItem(STORE.checked, JSON.stringify([...state.checked]));
}

function nutrientChip(name, extra = "") {
    const c = NUTRIENT_COLORS[name] || { bg: "#D0CAB2", fg: "#272216" };
    return `<span class="nutri-chip ${extra}" style="background:${c.bg};color:${c.fg}">${esc(name)}</span>`;
}

function missingChip(name) {
    return `<span class="nutri-chip miss">${esc(name)}</span>`;
}

// Separa una lista de nutrientes en macros y micros (en orden canónico)
function splitNutrients(names) {
    const set = new Set(names);
    return {
        macros: MACROS.filter((n) => set.has(n)),
        micros: MICROS.filter((n) => set.has(n))
    };
}

// Grupos de chips con etiqueta MACROS / MICROS (omite grupos vacíos)
function nutrientGroups(names, chipExtra = "small") {
    const { macros, micros } = splitNutrients(names);
    const group = (label, list) => list.length
        ? `<div class="ngroup"><span class="ng-label">${label}</span>${list.map((n) => nutrientChip(n, chipExtra)).join("")}</div>`
        : "";
    return group("MACRO", macros) + group("MICRO", micros);
}

// Recetas visibles según filtros (sin filtros = todas)
function visibleRecipes() {
    if (state.filters.size === 0) return RECIPES;
    return RECIPES.filter((r) => r.nutrients.some((n) => state.filters.has(n)));
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
    $("#meta-ingredients").textContent = allNames.size;

    // Nutrientes cubiertos por el recetario vs. los que faltan
    const covered = new Set([
        ...RECIPES.flatMap((r) => r.nutrients),
        ...[...allNames].flatMap((n) => INGREDIENT_NUTRIENTS[n] || [])
    ]);
    const presentMacros = MACROS.filter((n) => covered.has(n));
    const presentMicros = MICROS.filter((n) => covered.has(n));
    const missing = NUTRIENT_ORDER.filter((n) => !covered.has(n));

    $("#hero-nutrients").innerHTML = `
        <div class="hn-row">
            <span class="hn-label">MACROS</span>
            ${presentMacros.map((n) => nutrientChip(n, "small")).join("")}
        </div>
        <div class="hn-row">
            <span class="hn-label">MICROS</span>
            ${presentMicros.map((n) => nutrientChip(n, "small")).join("")}
        </div>
        <div class="hn-row">
            <span class="hn-label hn-falta">FALTA</span>
            ${missing.length ? missing.map(missingChip).join("") : '<span class="hn-none">nada 🎉</span>'}
        </div>`;
}

function renderRecipes() {
    $("#recipes-grid").innerHTML = RECIPES.map((r) => `
        <article class="recipe-card" data-recipe="${r.id}">
            <div class="card-emoji">${r.emoji}</div>
            <h3>${esc(r.name)}</h3>
            <p class="card-sub">${esc(r.subtitle)}</p>
            <div class="card-tags">
                ${nutrientGroups(r.nutrients)}
            </div>
            <div class="card-stats">
                <span><b>${r.ingredients.length}</b> ingredientes</span>
                <span class="card-link">Ver receta →</span>
            </div>
        </article>`
    ).join("");
}

function filterChip(n) {
    const count = RECIPES.filter((r) => r.nutrients.includes(n)).length;
    const on = state.filters.has(n);
    const c = NUTRIENT_COLORS[n] || { bg: "#D0CAB2", fg: "#272216" };
    const style = on ? `style="background:${c.bg};border-color:${c.bg};color:${c.fg}"` : "";
    const dot = on ? "" : `<span class="dot" style="background:${c.bg}"></span>`;
    return `
    <button class="chip ${on ? "on" : ""}" data-nutrient="${esc(n)}" ${style}>
        ${dot}${esc(n)} <span class="chip-count">(${count})</span>
    </button>`;
}

function renderFilters() {
    const used = new Set(RECIPES.flatMap((r) => r.nutrients));
    $("#filter-macros").innerHTML =
        MACROS.filter((n) => used.has(n)).map(filterChip).join("");
    $("#filter-micros").innerHTML =
        MICROS.filter((n) => used.has(n)).map(filterChip).join("");
}

function renderShoppingList() {
    const items = compileIngredients();
    const body = $("#shopping-body");

    if (items.length === 0) {
        body.innerHTML = `<tr class="empty-row"><td colspan="4">No hay ingredientes para mostrar.</td></tr>`;
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
        const nutrients = (INGREDIENT_NUTRIENTS[item.name] || []);
        const nutriCell = nutrients.length
            ? nutrientGroups(nutrients)
            : `<span class="no-nutri">—</span>`;
        return `
        <tr class="${done ? "done" : ""}">
            <td class="cell-check">
                <input type="checkbox" data-ing="${esc(item.name)}" ${done ? "checked" : ""}
                       aria-label="Comprado: ${esc(item.name)}">
            </td>
            <td class="cell-name">${esc(item.name)}${note}</td>
            <td><div class="badges">${badges}</div></td>
            <td><div class="nutri-cell">${nutriCell}</div></td>
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
        <div class="m-tags">
            ${nutrientGroups(r.nutrients)}
        </div>
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
    history.replaceState(null, "", tab === "shopping" ? "#ingredientes" : "#recetario");
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

    // Filtros multiselección por nutriente (macros y micros)
    $(".filter-bar").addEventListener("click", (e) => {
        const chip = e.target.closest("[data-nutrient]");
        if (!chip) return;
        const n = chip.dataset.nutrient;
        state.filters.has(n) ? state.filters.delete(n) : state.filters.add(n);
        save();
        renderFilters();
        renderShoppingList();
    });

    // Checklist + etiquetas de receta dentro de la tabla
    $("#shopping-body").addEventListener("click", (e) => {
        const badge = e.target.closest(".badge");
        if (badge) openRecipe(badge.dataset.recipe);
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
if (location.hash === "#ingredientes" || location.hash === "#compras") switchTab("shopping");
