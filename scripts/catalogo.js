document.addEventListener("DOMContentLoaded", async () => {
    // 1. Inicialización de Carrito/Selección (Mantener)
    const productosGuardados = localStorage.getItem("productosSeleccionados");
    // 'window.productosSeleccionados' actúa como el Carrito
    window.productosSeleccionados = productosGuardados ? JSON.parse(productosGuardados) : [];

    const contenedor = document.getElementById("catalogo-completo"); // Cambiado a tu ID
    const basePath = window.basePath || "";

    // **🛑 El código de detección de categoría por URL ha sido ELIMINADO 🛑**

    try {
        // 2. Cargar el Catálogo de Alfajores directamente (Ruta Fija)
        // Asegúrate que esta ruta es correcta: 'catalogo.json' o 'data/catalogo.json'
        const urlCatalogo = `${basePath}catalogo.json`;

        console.log('fetch URL:', urlCatalogo);
        const respuesta = await fetch(urlCatalogo);

        if (!respuesta.ok) {
            throw new Error(`Error al cargar el catálogo: ${respuesta.status}`);
        }

        const productos = await respuesta.json();

        // 3. Renderizado de Cards de Alfajores
        productos.forEach(producto => {
            const card = document.createElement("article");
            card.classList.add("product-card", "full-details"); // Clases de la card

            let etiquetaHTML = '';
            // Si quieres mantener etiquetas de 'OFERTA' o 'NUEVO', déjalas, si no, elimina este bloque
            if (producto.oferta) {
                etiquetaHTML = `<span class="etiqueta-oferta">OFERTA</span>`;
            }

            const precioAnteriorHTML = producto.precioAnterior
                ? `<span class="precio-anterior">S/ ${producto.precioAnterior.toFixed(2)}</span>`
                : "";

            // Eliminado infoPreventaHTML ya que 'preventa' no aplica

            card.innerHTML = `
                <img src="${basePath}${producto.imagen}" alt="${producto.nombre}" class="catalogo-img">
                <h3>${producto.nombre}</h3>
                ${etiquetaHTML}
                
                <p class="descripcion">${producto.descripcion_larga}</p>
                
                <p class="precio">
                    ${precioAnteriorHTML}
                    <span class="precio-actual">S/ ${producto.precio.toFixed(2)}</span>
                    <span class="units">(${producto.unidades} uds.)</span>
                </p>
                
                <div class="input-cantidad-wrapper">
                    <label for="cantidad-${producto.id}">Cantidad de Cajas:</label>
                    <input type="number" id="cantidad-${producto.id}" class="cantidad-pedido" min="1" value="1">
                </div>

                <button class="cta-add-to-cart">Agregar al Pedido</button> 
            `;

            contenedor.appendChild(card);

            // 4. Lógica del Botón "Agregar al Pedido"
            const botonElegir = card.querySelector('.cta-add-to-cart');
            botonElegir.addEventListener('click', () => {
                const inputCantidad = card.querySelector('.cantidad-pedido');
                const cantidad = inputCantidad ? parseInt(inputCantidad.value) : 1;

                if (cantidad < 1 || isNaN(cantidad)) {
                    alert('Por favor, ingrese una cantidad válida.');
                    return;
                }

                // No hay lógica de tallas ni preventa

                // **NOTA IMPORTANTE:** El stock en alfajores puede ser "disponible" o un número.
                // Si es un número, se debe adaptar la validación de stock.
                if (producto.stock !== "disponible" && producto.stock < cantidad) {
                    alert(`Solo quedan ${producto.stock} unidades de este producto en stock.`);
                    return;
                }


                const productoSeleccionado = { ...producto, talla: null, cantidad }; // Mantenemos talla en null por si acaso
                agregarProductoSeleccionado(productoSeleccionado);
                alert(`${cantidad} caja(s) de ${producto.nombre} agregada(s) a tu pedido.`);
            });
        });

        actualizarListaSeleccionados();

    } catch (error) {
        console.error("Error al cargar el catálogo:", error);
        contenedor.innerHTML = "<p>Error al cargar el catálogo de alfajores. Intente más tarde.</p>";
    }
});

// Mantener las funciones auxiliares, ya que son la lógica del carrito
function agregarProductoSeleccionado(producto) {
    const seleccionados = window.productosSeleccionados;
    // La búsqueda ya no considera la talla si es nula
    const indiceExistente = seleccionados.findIndex(p => p.id === producto.id);

    if (indiceExistente > -1) {
        seleccionados[indiceExistente].cantidad += producto.cantidad;
    } else {
        seleccionados.push(producto);
    }
    localStorage.setItem("productosSeleccionados", JSON.stringify(seleccionados));
    actualizarListaSeleccionados();
}

function actualizarListaSeleccionados() {
    // Esta función asume que tienes un modal o un sidebar para mostrar el pedido,
    // usando los IDs #lista-seleccionados y #total-precio.
    const lista = document.querySelector('#lista-seleccionados');
    const totalElemento = document.querySelector('#total-precio');
    const botonWhatsApp = document.querySelector('#boton-enviar-pedido-whatsapp'); // Suponemos que tienes un botón final

    if (!lista || !totalElemento) return;

    lista.innerHTML = "";
    let total = 0;

    window.productosSeleccionados.forEach((producto, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${producto.nombre} - ${producto.cantidad} un. - S/ ${(producto.precio * producto.cantidad).toFixed(2)}
            <button class="eliminar-producto" data-index="${index}">✕</button>
        `;
        lista.appendChild(li);
        total += producto.precio * producto.cantidad;
    });

    totalElemento.textContent = `Total: S/ ${total.toFixed(2)}`;

    // Habilitar/Deshabilitar el botón final de WhatsApp
    if (botonWhatsApp) {
        botonWhatsApp.disabled = window.productosSeleccionados.length === 0;
    }


    document.querySelectorAll(".eliminar-producto").forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = Number(e.target.getAttribute('data-index'));
            window.productosSeleccionados.splice(index, 1);
            localStorage.setItem("productosSeleccionados", JSON.stringify(window.productosSeleccionados));
            actualizarListaSeleccionados();
        });
    });

    // Esta línea puede o no ser necesaria dependiendo de cómo se active tu modal/sidebar
    // if (window.mostrarModal) window.mostrarModal();
}