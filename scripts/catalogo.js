document.addEventListener('DOMContentLoaded', () => {
    const contenedorProductos = document.getElementById('contenedor-productos');
    const RUTA_JSON = '../data/catalogo.json';

    // --- Funciones Auxiliares para localStorage ---

    function obtenerPedidosActuales() {
        const pedidosJSON = localStorage.getItem('haciendaSayanPedidos');
        return pedidosJSON ? JSON.parse(pedidosJSON) : [];
    }

    function guardarPedidos(pedidos) {
        localStorage.setItem('haciendaSayanPedidos', JSON.stringify(pedidos));
    }

    // Función que se ejecuta al hacer clic en 'Agregar'
    function agregarAlPedido(productoId, cantidad, productosDisponibles) {
        if (cantidad < 1 || isNaN(cantidad)) {
            alert('Por favor, ingresa una cantidad mayor a cero (mínimo 1 paquete).');
            return;
        }

        const pedidos = obtenerPedidosActuales();
        const productoInfo = productosDisponibles.find(p => p.id === productoId);

        if (!productoInfo) return;

        // Buscar si el producto ya está en la lista (sin considerar cantidad, solo ID)
        const itemExistente = pedidos.find(item => item.id === productoId);

        if (itemExistente) {
            // Si existe, sumar la cantidad nueva
            itemExistente.cantidad += cantidad;
        } else {
            // Si es nuevo, añadirlo con la cantidad seleccionada
            pedidos.push({
                id: productoId,
                nombre: productoInfo.nombre,
                precio: productoInfo.precio,
                unidades: productoInfo.unidades,
                cantidad: cantidad
            });
        }

        guardarPedidos(pedidos);

        // 🎯 INTEGRACIÓN CON MODAL: Dibuja el modal y lo muestra
        if (typeof actualizarListaSeleccionados === 'function') {
            actualizarListaSeleccionados(); // Dibuja la lista y el total
        }
        if (window.mostrarModal) {
            window.mostrarModal(); // Muestra el modal
        }
    }

    // --- Funciones de Carga y Renderizado ---

    async function obtenerProductos() {
        try {
            const response = await fetch(RUTA_JSON);
            if (!response.ok) {
                throw new Error(`Error al cargar el catálogo: ${response.status}`);
            }
            const productos = await response.json();
            mostrarProductos(productos);

            // 🛑 IMPORTANTE: Añadir el listener DEPUÉS de que el HTML existe
            setupEventListeners(productos);

            // 🎯 LLAMADA INICIAL AL CARGAR: Cargar la lista de pedidos al inicio
            if (typeof actualizarListaSeleccionados === 'function') {
                actualizarListaSeleccionados();
            }

        } catch (error) {
            console.error("Fallo al cargar el archivo de productos:", error);
            contenedorProductos.innerHTML = '<p class="error-msg">Lo sentimos, no pudimos cargar el catálogo. Por favor, inténtelo más tarde.</p>';
        }
    }

    // 🏆 FUNCIÓN CLAVE: Ahora incluye el input de Cantidad
    function crearTarjetaProducto(producto) {
        const precioActual = producto.precio.toFixed(2);

        let precioAnteriorHTML = '';
        if (producto.oferta && producto.precioAnterior) {
            const precioAnterior = producto.precioAnterior.toFixed(2);
            precioAnteriorHTML = `<span class="precio-anterior">S/ ${precioAnterior}</span>`;
        }

        const cardHTML = `
        <article class="product-card" data-id="${producto.id}" data-destacado="${producto.destacado}">
            <div class="product-image-container">
                <img src="${producto.imagen}" alt="Imagen de ${producto.nombre}" loading="lazy">
                ${producto.oferta ? '<span class="badge-oferta">¡Oferta!</span>' : ''}
            </div>
            <div class="card-content">
                <h3>${producto.nombre}</h3>
                <p class="descripcion">${producto.descripcion_corta}</p>
                <div class="product-details">
                    <p class="unidades">${producto.unidades} uds.</p>
                    <p class="stock ${producto.stock === 'disponible' ? 'stock-ok' : 'stock-agotado'}">Stock: ${producto.stock}</p>
                </div>

                <div class="price-container">
                    ${precioAnteriorHTML}
                    <p class="product-price">S/ ${precioActual}</p>
                </div>

                <div class="input-cantidad-wrapper">
                    <label for="cantidad-${producto.id}">Paquetes:</label>
                    <input type="number" id="cantidad-${producto.id}" class="cantidad-pedido" min="1" value="1">
                </div>

                <button class="cta-agregar" data-product-id="${producto.id}">
                    <i class="fas fa-plus"></i> Agregar
                </button>
                </div>
        </article>
    `;
        return cardHTML;
    }

    function mostrarProductos(productos) {
        if (!productos || productos.length === 0) {
            contenedorProductos.innerHTML = '<p>No hay productos disponibles en este momento.</p>';
            return;
        }
        let contenidoHTML = '';
        productos.forEach(producto => {
            contenidoHTML += crearTarjetaProducto(producto);
        });
        contenedorProductos.innerHTML = contenidoHTML;
    }

    // 🎯 FUNCIÓN CLAVE: Leer la cantidad del input
    function setupEventListeners(productosDisponibles) {
        contenedorProductos.addEventListener('click', (e) => {
            const button = e.target.closest('.cta-agregar');
            if (button) {
                const id = parseInt(button.dataset.productId);

                // 1. Encontrar el contenedor de la tarjeta (article.product-card)
                const card = button.closest('.product-card');

                // 2. Encontrar el input de cantidad DENTRO de esa tarjeta
                const inputCantidad = card.querySelector(`#cantidad-${id}`);
                const cantidad = inputCantidad ? parseInt(inputCantidad.value) : 1;

                agregarAlPedido(id, cantidad, productosDisponibles);
            }
        });

        // Listener para el botón global de "Ver Pedido/Ir a Formulario"
        const botonVerPedido = document.getElementById('ir-a-pedido-btn');
        if (botonVerPedido) {
            botonVerPedido.addEventListener('click', (e) => {
                e.preventDefault();

                if (window.mostrarModal) {
                    // 1. Asegurarse de actualizar la lista para que sepa si está vacío
                    if (typeof actualizarListaSeleccionados === 'function') {
                        actualizarListaSeleccionados();
                    }
                    // 2. Mostrar el modal (aunque esté vacío, para ver el mensaje)
                    window.mostrarModal();
                } else {
                    // Fallback (mantener la redirección)
                    window.location.href = '../formulario.html';
                }

                // const pedidos = obtenerPedidosActuales();
                // if (pedidos.length === 0) {
                //     alert("Tu pedido está vacío. ¡Agrega algunos alfajores!");
                //     return;
                // }

                // if (window.mostrarModal) {
                //     window.mostrarModal();
                // } else {
                //     window.location.href = '../formulario.html';
                // }

            });
        }
    }

    // Iniciar la carga de productos
    obtenerProductos();
});


// =================================================================
// FUNCIÓN GLOBAL PARA MANEJO DE MODAL/PEDIDOS (Fuera del DOMContentLoaded)
// =================================================================
function actualizarListaSeleccionados() {
    // Lee la lista de pedidos directamente del localStorage
    const pedidos = JSON.parse(localStorage.getItem('haciendaSayanPedidos') || '[]');

    // Asigna la lista a la variable global para que modal.js la detecte
    window.productosSeleccionados = pedidos;

    const lista = document.getElementById('lista-seleccionados');
    const totalElemento = document.getElementById('total-precio');
    const modal = document.getElementById('modal-seleccion');

    if (!lista || !totalElemento || !modal) return;

    lista.innerHTML = ""; // Limpiar la lista
    let total = 0;

    if (pedidos.length === 0) {
        lista.innerHTML = '<li>Tu pedido está vacío.</li>';
        totalElemento.textContent = `Total: S/ 0.00`;
        // Ocultar el modal si no hay ítems (función definida en modal.js)
        if (window.controlarVisibilidadModal) {
            window.controlarVisibilidadModal();
        }
        return;
    }

    pedidos.forEach((producto, index) => {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;

        const li = document.createElement("li");
        li.innerHTML = `
            <span class="item-info">
                ${producto.nombre} (${producto.unidades} uds.) x ${producto.cantidad} 
            </span>
            <span>
                S/ ${subtotal.toFixed(2)}
            </span>
            <button class="eliminar-producto" data-index="${index}" title="Eliminar Producto">
                ✕
            </button>
        `;
        lista.appendChild(li);
    });

    totalElemento.textContent = `Total: S/ ${total.toFixed(2)}`;

    // Añadir listeners para los botones de eliminar (la X)
    document.querySelectorAll(".eliminar-producto").forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = Number(e.target.getAttribute('data-index'));

            // Eliminar el producto del array
            pedidos.splice(index, 1);

            // Guardar y actualizar el DOM
            localStorage.setItem("haciendaSayanPedidos", JSON.stringify(pedidos));

            // 🎯 LLAMADA RECURSIVA para redibujar la lista y actualizar el total
            actualizarListaSeleccionados();
        });
    });

    // 🎯 INTEGRACIÓN CON MODAL: Asegura la visibilidad cuando se dibuja la lista
    if (window.controlarVisibilidadModal) {
        window.controlarVisibilidadModal(); // Esto manejará si debe mostrarse o minimizarse
    }
}