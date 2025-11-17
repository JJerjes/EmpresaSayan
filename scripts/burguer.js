// const menuBtn = document.getElementById('menu');
// const nav = document.getElementById('nav');
// const body = document.body;
// const main = document.querySelector('main');

// menuBtn.addEventListener('click', () => {
//     menuBtn.classList.toggle('open');
//     nav.classList.toggle('open');
//     body.classList.toggle('menu-open');

//     if (body.classList.contains('menu-open')) {
//         const header = document.querySelector('header');
//         const navHeight = nav.offsetHeight;
//         const headerHeight = header.offsetHeight;
//         const totalHeight = headerHeight + navHeight;
//         main.style.marginTop = `${totalHeight}px`;
//     } else {
//         main.style.marginTop = '';
//     }
// });

// // 👇 Este bloque cierra el menú al hacer clic en cualquier enlace
// document.querySelectorAll('.nav a').forEach(link => {
//     link.addEventListener('click', () => {
//         menuBtn.classList.remove('open');
//         nav.classList.remove('open');
//         body.classList.remove('menu-open');
//         main.style.marginTop = '';
//     });
// });


const menuBtn = document.getElementById('menu-toggle'); // Usar 'menu-toggle' como en el HTML
const nav = document.getElementById('nav');
const body = document.body;
// Eliminamos la referencia a 'main' y el cálculo de alturas

menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('open');
    nav.classList.toggle('is-open'); // Usar 'is-open' como en el CSS
    body.classList.toggle('menu-active'); // Nueva clase simple para el body
});

// Este bloque cierra el menú al hacer clic en cualquier enlace (perfecto)
document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', () => {
        menuBtn.classList.remove('open');
        nav.classList.remove('is-open');
        body.classList.remove('menu-active');
        // Eliminamos main.style.marginTop aquí
    });
});