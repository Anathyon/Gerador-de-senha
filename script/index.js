"use strict";
const campo_de_valor = document.querySelector("#Quantidade");
let input_range = document.querySelector("#range");
const btn_gerador = document.querySelector("#btn_gera_senha");
const local_senha = document.querySelector("#local_senha");
const txt_senha = document.querySelector("#txt_senha");
let senha = document.querySelector("#senha");
const sp_hov = document.querySelector("#sp_hov");
let possibilidades = "qwertyuiopasdfghjklçzxcvbnm1234567890!@#$%¨&*()";
let nova_senha = "";
campo_de_valor.innerHTML = " " + input_range.value;
input_range.addEventListener("input", function () {
    campo_de_valor.innerHTML = " " + this.value;
});
btn_gerador.addEventListener("click", function () {
    let senha_p = "";
    const val_input = parseInt(input_range.value);
    for (let i = 0; i < val_input; i++) {
        senha_p += possibilidades.charAt(Math.floor(Math.random() * possibilidades.length));
    }
    senha.innerHTML = senha_p;
    if (senha === undefined || senha_p === "") {
        local_senha.classList.add("hide");
    }
    else {
        local_senha.classList.remove("hide");
    }
});
senha.addEventListener("touchstart", function () {
    senha.classList.add("hover-active");
});
senha.addEventListener("touchend", function () {
    senha.classList.remove("hover-active");
});
btn_gerador.addEventListener("touchstart", function () {
    btn_gerador.style.transform = 'scale(1.05)';
});
btn_gerador.addEventListener("touchend", function () {
    btn_gerador.style.transform = 'scale(1)';
});
const verifica_mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
btn_gerador.addEventListener("click", function () {
    if (verifica_mobile) {
        alert("Senha copiada para a área de transferência!");
        navigator.clipboard.writeText(senha.innerText).catch((err) => {
            alert("Erro ao copiar a senha!");
            console.error("Erro ao copiar a senha: ", err);
            sp_hov.classList.add("mobile");
        });
    }
});
senha.addEventListener("click", function () {
    if (!verifica_mobile) {
        navigator.clipboard.writeText(senha.innerText)
            .then(() => {
            alert("Senha copiada para a área de transferência!");
        }).catch((err) => {
            alert("Erro ao copiar a senha!");
            console.error("Erro ao copiar a senha: ", err);
        });
    }
});
