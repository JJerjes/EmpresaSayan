document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('delivery-form');
    // 🔔 CONFIGURA LA URL DE TU BACKEND AQUÍ
    const BACKEND_ENDPOINT = 'URL_DE_TU_SERVIDOR/api/confirmar-pedido'; // Ejemplo: 'https://midominio.com/api/confirmar-pedido'

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault(); // Detiene el envío HTTP tradicional

            // 1. CAPTURA DE DATOS DEL FORMULARIO
            const data = {
                nombre: document.getElementById('nombre').value.trim(),
                celular: document.getElementById('celular').value.trim(),
                email: document.getElementById('email').value.trim(),
                dni: document.getElementById('dni').value.trim(),
                // Capturamos el texto visible del tipo de entrega
                tipoEntrega: document.getElementById('tipo_entrega').options[document.getElementById('tipo_entrega').selectedIndex].text.trim()
                // Nota: Si tu formulario tiene productos, la lógica para capturarlos debe ir aquí
            };

            // 2. ENVÍO DE DATOS AL BACKEND
            try {
                const response = await fetch(BACKEND_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    // El servidor respondió correctamente (200-299)
                    const result = await response.json();

                    // Mostrar mensaje de éxito basado en la respuesta
                    alert(`✅ Pedido confirmado. Se ha enviado un correo a ${data.email} con los detalles.`);

                    // Opcional: Limpiar formulario después del envío exitoso
                    form.reset();

                } else {
                    // El servidor respondió con un error (4xx o 5xx)
                    const errorData = await response.json();
                    console.error('Error del servidor:', errorData);
                    alert(`❌ Hubo un problema al procesar tu pedido. Por favor, intenta más tarde o contáctanos directamente. Error: ${errorData.message || response.statusText}`);
                }
            } catch (error) {
                // Error de red, URL incorrecta o servidor inalcanzable
                console.error('Error de conexión:', error);
                alert('❌ Error de conexión: No se pudo contactar al servidor. Revisa tu conexión.');
            }
        });
    }
});






// document.addEventListener('DOMContentLoaded', async () => {
//     const form = document.getElementById('contact-form');
//     const inputs = form.querySelectorAll('input, select');

//     const listaSeleccionados = document.getElementById('lista-seleccionados');
//     const totalPrecioDiv = document.getElementById('total-precio');

//     const branchSelect = document.getElementById('branch');
//     const hourSelect = document.getElementById('hour');
//     const sectionInput = document.getElementById('section');

//     // Recuperar productos desde localStorage
//     let productosSeleccionados = JSON.parse(localStorage.getItem('productosSeleccionados')) || [];
//     let totalPrecio = 0;

//     // Función para actualizar la lista y calcular total
//     function actualizarListaProductos(productos) {
//         productosSeleccionados = productos;

//         if (listaSeleccionados) {
//             listaSeleccionados.innerHTML = '';
//             totalPrecio = 0;

//             productos.forEach(producto => {
//                 const { nombre, precio, cantidad } = producto;
//                 const item = document.createElement('li');
//                 item.textContent = `${nombre}${producto.talla ? ` (talla: ${producto.talla})` : ''} - ${cantidad} unidad(es) - Precio: S/${(precio * cantidad).toFixed(2)}`;
//                 listaSeleccionados.appendChild(item);

//                 totalPrecio += precio * cantidad;
//             });


//             // productos.forEach(producto => {
//             //     const { nombre, precio } = producto;
//             //     const item = document.createElement('li');
//             //     item.textContent = `${nombre}  - Precio: S/${Number(precio).toFixed(2)}`;
//             //     listaSeleccionados.appendChild(item);

//             //     totalPrecio += Number(precio);
//             // });
//         }

//         if (totalPrecioDiv) {
//             totalPrecioDiv.textContent = `Total: S/${totalPrecio.toFixed(2)}`;
//         }
//     }

//     actualizarListaProductos(productosSeleccionados);

//     function validarCampo(campo) {
//         if (campo.checkValidity()) {
//             campo.classList.add('completo');
//             campo.classList.remove('incompleto');
//             return true;
//         } else {
//             campo.classList.add('incompleto');
//             campo.classList.remove('completo');
//             return false;
//         }
//     }

//     inputs.forEach(input => {
//         input.addEventListener('input', () => validarCampo(input));
//         input.addEventListener('change', () => validarCampo(input));
//     });

//     // ----------- NUEVO: Cargar horarios y representante según estación -----------
//     let disponibilidad = [];

//     const cargarDisponibilidad = async () => {
//         try {
//             const response = await fetch('../data/disponibilidad.json');
//             const data = await response.json();
//             disponibilidad = data.estaciones_del_tren || [];
//         } catch (error) {
//             console.error('Error al cargar disponibilidad:', error);
//         }
//     };

//     await cargarDisponibilidad(); // Esperar que cargue antes de habilitar selección

//     const actualizarHorarioYRepresentante = (index) => {
//         hourSelect.innerHTML = '<option value="" disabled selected>Seleccione hora</option>';
//         sectionInput.value = '';

//         if (disponibilidad[index] && disponibilidad[index].length > 0) {
//             const { inicio, fin, repre } = disponibilidad[index][0];
//             sectionInput.value = repre;

//             const [inicioHora, inicioMin] = inicio.split(':').map(Number);
//             const [finHora, finMin] = fin.split(':').map(Number);

//             let current = new Date();
//             current.setHours(inicioHora, inicioMin, 0, 0);

//             const end = new Date();
//             end.setHours(finHora, finMin, 0, 0);

//             while (current <= end) {
//                 const horaStr = current.toTimeString().slice(0, 5); // "HH:MM"
//                 const option = document.createElement('option');
//                 option.value = horaStr;
//                 option.textContent = horaStr;
//                 hourSelect.appendChild(option);

//                 current.setMinutes(current.getMinutes() + 30);
//             }
//         }
//     };

//     branchSelect.addEventListener('change', () => {
//         const index = branchSelect.selectedIndex - 1; // Elimina "Seleccione una estación"
//         actualizarHorarioYRepresentante(index);
//     });

//     // ----------- Envío del formulario -----------
//     form.addEventListener('submit', async (e) => {
//         e.preventDefault();

//         let formularioValido = true;

//         inputs.forEach(input => {
//             if (!input.disabled && input.offsetParent !== null) {
//                 const esValido = validarCampo(input);
//                 if (!esValido) formularioValido = false;
//             }
//         });

//         if (!formularioValido) {
//             alert('Por favor completa todos los campos en rojo.');
//             return;
//         }

//         if (productosSeleccionados.length === 0) {
//             alert('No hay productos seleccionados para el pedido.');
//             return;
//         }

//         const nombre = form.querySelector('#name').value;
//         const email = form.querySelector('#email').value;
//         const telefono = form.querySelector('#phone').value;
//         const fecha = form.querySelector('#date').value;
//         const hora = form.querySelector('#hour').value;
//         const branch = form.querySelector('#branch').value;
//         const representante = form.querySelector('#section').value;

//         const data = {
//             nombre,
//             email,
//             telefono,
//             fecha,
//             hora,
//             branch,
//             representante,
//             productos: productosSeleccionados,
//             total: totalPrecio
//         };

//         try {
//             const response = await fetch('http://localhost:5000/confirmar-compra', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(data)
//             });

//             const result = await response.json();

//             if (response.ok) {
//                 alert("✅ Pedido confirmado. Revisa tu correo.");
//                 form.reset();
//                 localStorage.removeItem('productosSeleccionados');
//                 localStorage.removeItem('totalPrecio');
//                 actualizarListaProductos([]);
//                 window.location.href = '/';
//             } else {
//                 alert(`⚠️ Error: ${result.error || 'No se pudo confirmar el pedido.'}`);
//             }
//         } catch (error) {
//             console.error('❌ Error al enviar:', error);
//             alert("Ocurrió un error al confirmar el pedido.");
//         }
//     });
// });
