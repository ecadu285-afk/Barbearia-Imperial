
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
