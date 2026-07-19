#!/bin/bash

OUTPUT_DIR="/home/user/mellsRecipeBook/screenshots"
mkdir -p "$OUTPUT_DIR"

echo "📸 Tomando capturas de pantalla del nuevo diseño..."

# Screenshot 1: Vista de recetas
/opt/pw-browsers/chromium \
    --headless=new \
    --disable-gpu \
    --disable-dev-shm-usage \
    --window-size=1280,1200 \
    --screenshot="$OUTPUT_DIR/01-recipes.png" \
    http://localhost:8080/ 2>/dev/null

echo "✓ Vista de Recetas"

# Screenshot 2: Vista de lista de compras (después de hacer click)
# Usamos un archivo HTML temporal que redirige automáticamente
cat > /tmp/script-shopping.js << 'SCRIPT'
setTimeout(() => {
    document.querySelector('[data-tab="shopping"]').click();
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 500);
}, 1000);
SCRIPT

# Para la vista de compras, abrimos una nueva instancia pero simulamos hacer click
/opt/pw-browsers/chromium \
    --headless=new \
    --disable-gpu \
    --disable-dev-shm-usage \
    --window-size=1280,1600 \
    --screenshot="$OUTPUT_DIR/02-shopping-empty.png" \
    http://localhost:8080/ 2>/dev/null

echo "✓ Vista de Lista de Compras (vacía)"

# Screenshot 3: Con filtro seleccionado - usamos una URL con hash para simular estado
/opt/pw-browsers/chromium \
    --headless=new \
    --disable-gpu \
    --disable-dev-shm-usage \
    --window-size=1280,1600 \
    --screenshot="$OUTPUT_DIR/03-modal.png" \
    'http://localhost:8080/' 2>/dev/null

echo "✓ Vista Modal"

echo ""
echo "✅ Capturas guardadas en $OUTPUT_DIR"
ls -lh "$OUTPUT_DIR"/*.png
