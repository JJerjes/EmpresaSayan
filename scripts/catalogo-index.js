// scripts/catalogo-index.js
document.addEventListener("DOMContentLoaded", async () => {
    // 1. Apunta al contenedor específico del index
    const contenedor = document.getElementById("productos-destacados");
    if (!contenedor) return;

    const basePath = window.basePath || "";

    try {
        // 2. Cargar el Catálogo de Alfajores
        const urlCatalogo = `${basePath}data/catalogo.json`;
        const respuesta = await fetch(urlCatalogo);

        if (!respuesta.ok) {
            throw new Error(`Error al cargar el catálogo: ${respuesta.status}`);
        }

        const productos = await respuesta.json();

        // 🛑 Lógica Clave: Limitar a las 3 primeras cards 🛑
        const destacados = productos.slice(0, 3);

        // 3. Renderizado de las 3 Cards
        destacados.forEach(producto => {
            const card = document.createElement("article");
            card.classList.add("product-card");

            const precioFormateado = `S/ ${producto.precio.toFixed(2)}`;

            card.innerHTML = `
                <div class="card-header">
                    <h3>${producto.nombre}</h3>
                </div>
                
                <img src="${basePath}${producto.imagen}" 
                    alt="${producto.nombre}" 
                    class="card-image" 
                    loading="lazy">
                
                <div class="card-info">
                    <p class="description"><b>Descripcion:</b> ${producto.descripcion_corta}<br></p>
                    
                    <p class="units-price-info">
                        <br><b>Cantidad:</b> Caja de ${producto.unidades} unidades
                    </p>
                    <p class="product-price">
                        <br><strong>Precio:</strong> ${precioFormateado}
                    </p>
                    
                    <a href="catalogo.html" class="cta-secondary-card">
                        Ver Catálogo y Pedir
                    </a>
                </div>
            `;
            contenedor.appendChild(card);
        });

    } catch (error) {
        console.error("Error al cargar productos destacados:", error);
        contenedor.innerHTML = "<p class='error-message'>No se pudieron cargar los productos destacados.</p>";
    }
});

// Nota: Las funciones de carrito (agregarProductoSeleccionado, etc.) no son necesarias en el index,
// ya que el botón dirige al catálogo completo.