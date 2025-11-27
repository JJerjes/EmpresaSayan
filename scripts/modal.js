document.addEventListener("DOMContentLoaded", () => {
    let intentos = 0;
    const maxIntentos = 50;

    // Función de control de visibilidad (se necesita aquí y en el setInterval)
    function controlarVisibilidadModal() {
        // Lee directamente la lista de pedidos con la clave UNIFICADA.
        const pedidos = JSON.parse(localStorage.getItem('haciendaSayanPedidos') || '[]');
        const modal = document.getElementById('modal-seleccion');
        const barra = document.getElementById('barra-carrito');

        if (modal && barra) {
            if (pedidos.length > 0) {
                // Usar 'block' o 'flex' para mostrar el modal (depende de tu CSS)
                modal.style.display = 'block';
                barra.style.display = 'none';
                // Asegura que al cargar, si hay items, se muestre el modal o se minimice
            } else {
                modal.style.display = 'none';
                barra.style.display = 'none';
            }
        }
    }

    const esperarModal = setInterval(() => {
        const modal = document.getElementById('modal-seleccion');
        const barra = document.getElementById('barra-carrito');
        const btnMinimizar = document.getElementById('minimizar-modal');
        const btnRestaurar = document.getElementById('restaurar-modal');
        const btnHacerPedido = document.getElementById("hacer-pedido");

        if (modal && barra && btnMinimizar && btnRestaurar && btnHacerPedido) {
            clearInterval(esperarModal);

            // Funciones de control de estado del modal (simples)
            function restaurarModal() {
                modal.style.display = 'block';
                barra.style.display = 'none';
            }

            function minimizarModal() {
                modal.style.display = 'none';
                barra.style.display = 'flex';
            }

            btnMinimizar.addEventListener('click', minimizarModal);
            btnRestaurar.addEventListener('click', restaurarModal);

            btnHacerPedido.addEventListener('click', () => {
                const pedidos = JSON.parse(localStorage.getItem('haciendaSayanPedidos') || '[]');

                if (pedidos.length === 0) {
                    alert('No hay productos seleccionados para hacer el pedido.');
                    return;
                }

                // Redirigir al formulario
                const basePath = window.basePath || '../'; // Usamos ruta relativa segura
                window.location.href = basePath + "../categorias/formulario.html";
            });

            // Exponer funciones necesarias globalmente
            window.mostrarModal = restaurarModal;
            window.controlarVisibilidadModal = controlarVisibilidadModal;

            // Al iniciar, forzar la primera carga y visibilidad (usando la clave UNIFICADA)
            controlarVisibilidadModal();

        } else {
            if (++intentos >= maxIntentos) {
                clearInterval(esperarModal);
                console.warn('⚠️ No se pudo encontrar el modal o botones tras varios intentos.');
            } else {
                // console.log('⏳ Esperando que el modal esté disponible en el DOM...');
            }
        }
    }, 100);
});