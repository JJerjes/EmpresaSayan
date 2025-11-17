document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector('.carousel-wrapper');
    const slides = document.querySelectorAll('.carousel-slide');
    const next = document.querySelector('.carousel-next');
    const prev = document.querySelector('.carousel-prev');

    if (!wrapper || slides.length === 0) return;

    let currentIndex = 0;
    const total = slides.length;
    const intervalTime = 7000;

    const goToSlide = index => {
        wrapper.scrollTo({ left: wrapper.clientWidth * index, behavior: 'smooth' });
        currentIndex = index
    }

    next.addEventListener('click', () => goToSlide((currentIndex + 1) % total));
    prev.addEventListener('click', () => goToSlide((currentIndex - 1 + total) % total));

    setInterval(() => {
        goToSlide((currentIndex + 1) % total);
    }, intervalTime);
});