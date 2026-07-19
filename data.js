// ============================================================
// Mell's Recipe Book · datos
//
// Para añadir una receta: copia un bloque, dale un id nuevo y
// usa el mismo nombre de ingrediente que en otras recetas para
// que se agrupe en la lista de ingredientes.
//
// Si añades un ingrediente nuevo, regístralo también en
// INGREDIENT_NUTRIENTS con lo que aporta.
// ============================================================

// --- Universo de nutrientes (para calcular qué cubre y qué falta) ---

const MACROS = ["Proteína", "Carbohidratos", "Grasas", "Fibra"];

const MICROS = [
    "Vitamina A", "Vitaminas B", "Vitamina C", "Vitamina D",
    "Vitamina E", "Vitamina K", "Calcio", "Hierro",
    "Magnesio", "Potasio", "Zinc", "Omega-3", "Yodo"
];

// --- Color de cada nutriente (paleta del recetario) ---

const NUTRIENT_COLORS = {
    "Proteína":      { bg: "#D25067", fg: "#EEEADA" },
    "Carbohidratos": { bg: "#D7A36A", fg: "#272216" },
    "Grasas":        { bg: "#E8E16B", fg: "#272216" },
    "Fibra":         { bg: "#6D8D5C", fg: "#EEEADA" },
    "Vitamina A":    { bg: "#AB813B", fg: "#EEEADA" },
    "Vitaminas B":   { bg: "#A86B8B", fg: "#EEEADA" },
    "Vitamina C":    { bg: "#AECF60", fg: "#272216" },
    "Vitamina D":    { bg: "#6695E6", fg: "#EEEADA" },
    "Vitamina E":    { bg: "#758B95", fg: "#EEEADA" },
    "Vitamina K":    { bg: "#6A6E4B", fg: "#EEEADA" },
    "Calcio":        { bg: "#E5D2A2", fg: "#272216" },
    "Hierro":        { bg: "#3633AF", fg: "#EEEADA" },
    "Magnesio":      { bg: "#D0CAB2", fg: "#272216" },
    "Potasio":       { bg: "#D8ABA3", fg: "#272216" },
    "Zinc":          { bg: "#758B95", fg: "#EEEADA" },
    "Omega-3":       { bg: "#6695E6", fg: "#EEEADA" },
    "Yodo":          { bg: "#3633AF", fg: "#EEEADA" }
};

// --- Qué aporta cada ingrediente ---

const INGREDIENT_NUTRIENTS = {
    "Yogur natural":     ["Proteína", "Calcio", "Vitaminas B"],
    "Tomates cherry":    ["Vitamina C", "Vitamina A", "Potasio"],
    "Tomates":           ["Vitamina C", "Vitamina A", "Potasio"],
    "Pimiento rojo":     ["Vitamina C", "Vitamina A"],
    "Ajo":               ["Vitaminas B"],
    "Pasta de ajo":      ["Vitaminas B"],
    "Champiñones":       ["Vitamina D", "Vitaminas B", "Potasio"],
    "Huevo":             ["Proteína", "Grasas", "Vitamina D", "Vitaminas B", "Hierro", "Zinc"],
    "Eneldo":            ["Vitamina C"],
    "Aceite en spray":   ["Grasas"],
    "Pan tostado":       ["Carbohidratos", "Fibra"],
    "Paprika":           ["Vitamina A", "Vitamina E"],
    "Mantequilla":       ["Grasas", "Vitamina A"],
    "Hojuelas de chili": ["Vitamina A"],
    "Cebollín":          ["Vitamina K", "Vitamina C"],
    "Aguacate":          ["Grasas", "Fibra", "Potasio", "Vitamina E", "Vitamina K", "Magnesio"],
    "Bocconcini":        ["Proteína", "Grasas", "Calcio"],
    "Queso cottage":     ["Proteína", "Calcio", "Vitaminas B"],
    "Camote":            ["Carbohidratos", "Fibra", "Vitamina A", "Vitamina C", "Potasio"],
    "Feta":              ["Proteína", "Grasas", "Calcio"],
    "Sal":               [],
    "Pimienta":          [],
    "Especias":          []
};

// --- Recetas ---

const RECIPES = [
    {
        id: "la-og",
        name: "La OG",
        subtitle: "Yogur salado con huevo",
        emoji: "🥣",
        accent: "#6695E6",
        nutrients: ["Proteína", "Vitamina A", "Vitamina C", "Vitamina D"],
        intro: "Yogur griego condimentado con eneldo y pasta de ajo, cubierto con tomates cherry, pimiento y champiñones asados al air fryer y un huevo cocido de yema suave. Se sirve con pan tostado.",
        ingredients: [
            { name: "Yogur natural", note: "griego, sin azúcar" },
            { name: "Tomates cherry" },
            { name: "Pimiento rojo" },
            { name: "Ajo" },
            { name: "Champiñones" },
            { name: "Huevo", note: "1 unidad" },
            { name: "Sal" },
            { name: "Pimienta" },
            { name: "Eneldo" },
            { name: "Pasta de ajo" },
            { name: "Aceite en spray" },
            { name: "Pan tostado", note: "1 rebanada, para acompañar" }
        ],
        steps: [
            "Coloca tomates, pimiento, ajo y champiñones en un recipiente apto para horno, rocía aceite y salpimienta. Air fryer hasta que se ampollen y doren.",
            "Hierve el huevo 6 minutos, pásalo 2 minutos a agua fría y pélalo (golpea, rueda y pela desde la base).",
            "Condimenta el yogur con sal, pimienta, eneldo y pasta de ajo.",
            "Cubre con los vegetales asados y el huevo; termina con sal, pimienta y eneldo. Sirve con el pan."
        ]
    },
    {
        id: "cilbir",
        name: "Çılbır",
        subtitle: "Versión turca",
        emoji: "🥚",
        accent: "#D7A36A",
        nutrients: ["Proteína", "Grasas", "Calcio", "Vitamina D"],
        intro: "Huevos pasados por agua sobre una base de yogur especiado con paprika, ajo y eneldo, bañados en mantequilla derretida con hojuelas de chili. Se acompaña con pan tostado.",
        ingredients: [
            { name: "Yogur natural" },
            { name: "Sal", note: "para el yogur" },
            { name: "Pimienta", note: "para el yogur" },
            { name: "Paprika", note: "para el yogur y la mantequilla" },
            { name: "Ajo", note: "para el yogur" },
            { name: "Eneldo", note: "para el yogur" },
            { name: "Huevo", note: "2 unidades" },
            { name: "Mantequilla" },
            { name: "Hojuelas de chili" },
            { name: "Pan tostado", note: "1 rebanada" }
        ],
        steps: [
            "Mezcla el yogur con sal, pimienta, paprika, ajo y eneldo.",
            "Cuece los 2 huevos pasados por agua, 3–4 minutos.",
            "Derrite la mantequilla con hojuelas de chili y paprika (air fryer o microondas).",
            "Monta: base de yogur, los huevos encima, la mantequilla especiada y un poco más de chili. Sirve con el pan."
        ]
    },
    {
        id: "camote-guac",
        name: "Camote y guacamole",
        subtitle: "Bowl vegetal cremoso",
        emoji: "🥑",
        accent: "#6D8D5C",
        nutrients: ["Carbohidratos", "Grasas", "Fibra", "Calcio", "Vitamina A", "Potasio"],
        intro: "Bowl sobre yogur condimentado con cebollín, armado con guacamole, camote asado, tomates horneados con bocconcini y queso cottage, ajo y champiñones. Se termina con feta desmenuzado.",
        ingredients: [
            { name: "Yogur natural" },
            { name: "Sal", note: "para el yogur y el guacamole" },
            { name: "Pimienta", note: "para el yogur" },
            { name: "Pasta de ajo", note: "para el yogur" },
            { name: "Eneldo", note: "para el yogur" },
            { name: "Cebollín", note: "para el yogur" },
            { name: "Aguacate", note: "para el guacamole" },
            { name: "Tomates" },
            { name: "Bocconcini" },
            { name: "Queso cottage" },
            { name: "Especias" },
            { name: "Camote", note: "en trozos, cocido o asado" },
            { name: "Ajo" },
            { name: "Champiñones" },
            { name: "Feta", note: "para terminar" }
        ],
        steps: [
            "Condimenta el yogur con sal, pimienta, pasta de ajo, eneldo y cebollín.",
            "Prepara un guacamole simple machacando el aguacate (con sal y lo que gustes).",
            "Asa los tomates y los bocconcini con especias y el queso cottage.",
            "Arma el bowl sobre el yogur: guacamole, tomates, trozos de camote, ajo y champiñones.",
            "Termina con un poco de feta."
        ]
    }
];
