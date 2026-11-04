
document.addEventListener("DOMContentLoaded", () => {
    const botaoMenu = document.querySelector(".menu-mobile");
    const menu = document.querySelector("header nav");

    if (botaoMenu && menu) {
        botaoMenu.addEventListener("click", () => {
            menu.classList.toggle("menu-aberto");
        });
    }

    console.log("Barbearia Imperial 2.0 carregada!");
});

/* BARBEARIA IMPERIAL 2.0 — ANIMAÇÕES DE ENTRADA */

document.addEventListener("DOMContentLoaded", () => {
    const elementos = document.querySelectorAll(
        ".servico, .galeria-fotos img, .sobre h2, .servicos h2, .agendamento h2"
    );

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    if (!("IntersectionObserver" in window)) {
        return;
    }

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("visivel");
                observador.unobserve(entrada.target);
            }
        });
    }, {
        threshold: 0.1
    });

    elementos.forEach((elemento) => {
        elemento.classList.add("animar-entrada");
        observador.observe(elemento);
    });
});
