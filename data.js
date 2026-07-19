// ============================================================
// Mell's Recipe Book · datos
// Para añadir una receta: copia un bloque, dale un id nuevo y
// usa el mismo nombre de ingrediente que en otras recetas para
// que se agrupe en la lista de compras.
// ============================================================

const RECIPES = [
    {
        id: "la-og",
        name: "La OG",
        subtitle: "Yogur salado con huevo",
        category: "Bowl proteico",
        emoji: "🥣",
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
        category: "Bowl proteico",
        emoji: "🥚",
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
        category: "Bowl vegetal",
        emoji: "🥑",
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
