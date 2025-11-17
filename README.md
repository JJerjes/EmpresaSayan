# 🇦🇷 Hacienda Sayan: Plataforma Digital de Pedidos

[Logotipo de Hacienda Sayan, cuando lo tengas]

Un sitio web profesional y **responsive** especializado en la venta de alfajores **al por mayor y menor**. El proyecto se centra en modernizar la presencia digital de los fundadores originales de los alfajares de peajes y estaciones de tren de Lima. Desarrollado bajo la metodología **Mobile First** para garantizar una experiencia de usuario óptima.

---

## 🎯 Objetivos del Proyecto

* **Historia y Marca:** Destacar la historia fundacional única de Hacienda Sayan en la sección "Nuestra Historia".
* **Diseño Profesional:** Implementar un diseño **Mobile First** y **Responsive** con `min-width` para total adaptabilidad.
* **Sistema de Pedidos Avanzado:** Crear un formulario de contacto/pedido que soporte órdenes **Al por Mayor/Menor** y pedidos especiales para **Eventos**.
* **Gestión de Conversión:** Integrar enlaces directos a **Redes Sociales** y botones de contacto rápido (**Llamar** y **WhatsApp**).
* **Control de Pedidos:** Facilitar el control de ventas a través de notificaciones por correo y la visualización de **Catálogo** y **Promociones**.

---

## 📋 Alcance del Formulario de Pedidos

El formulario es el componente central del proyecto y tendrá el siguiente alcance funcional:

* **Tipos de Pedido:** General (por menor) y para **Eventos**.
* **Información de Pago:** Inclusión de datos de pago vía **Yape** y **Números de Cuenta** bancarios en el flujo de pedido.
* **Notificaciones:** El **Backend en Python** gestionará el envío de correo de confirmación al cliente y el correo de control a los dueños.

---

## 💻 Pila Tecnológica

| Componente | Tecnología | Notas |
| :--- | :--- | :--- |
| **Interfaz (Frontend)** | HTML5, CSS3 | Diseño Responsive (`min-width`) y **Single Page Application** (5 secciones: Hero, Historia, Catálogo/Promociones, Valor/Servicios, Pedidos/Contacto). |
| **Comportamiento (Frontend)** | JavaScript (Vanilla JS) | Interactividad, validación del formulario y navegación fluida. |
| **Lógica (Backend)** | Python | Gestión del formulario de pedidos y del servicio de envío de correos (SMTP). |
| **Control de Versiones** | Git / GitHub | Repositorio público para control de cambios y avance. |

---

## ⚙️ Guía de Inicio Rápido (Configuración Local)

Sigue estos pasos para poner el proyecto en funcionamiento en tu máquina local:

1.  **Clonar el Repositorio:**
    ```bash
    git clone [https://github.com/JJerjes/EmpresaSayan.git](https://github.com/JJerjes/EmpresaSayan.git)
    cd EmpresaSayan
    ```
2.  **Configuración de Python (Backend):**
    * Crea un entorno virtual.
    * Instala las librerías necesarias para el envío de correos (ej: `smtplib` si es nativo, o alguna librería si usas un framework).
    ```bash
    # Se asume el uso de un entorno virtual (venv)
    python -m venv venv
    source venv/bin/activate # En Windows usa: venv\Scripts\activate
    pip install [librerías requeridas para backend/correos]
    ```
3.  **Ejecutar el Frontend:**
    * El `index.html` puede abrirse directamente en cualquier navegador moderno.
    * Para probar la funcionalidad de **Backend (Python)**, necesitarás configurar un servidor local que pueda manejar peticiones POST y ejecutar el script de Python (ej: utilizando Flask o un servidor simple de Python).

---

## ✒️ Autor

**Junior Jerjes** - Desarrollador Web

---

## 📜 Licencia

[Aquí puedes indicar el tipo de licencia que elijas, por ejemplo: MIT License]
