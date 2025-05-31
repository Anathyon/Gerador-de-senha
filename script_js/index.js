"use strict";
const inputTitulo = document.querySelector("#titulo");
const dialog = document.querySelector("#historico_dialog");
const btnExibir = document.querySelector("#btn_exibir_historico");
const btnFechar = document.querySelector("#btn_fechar");
const btnLimpar = document.querySelector("#btn_limpar_historico");
const lista = document.querySelector("#historico_lista");
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
const historico = () => {
    lista.innerHTML = "";
    const historico = JSON.parse(localStorage.getItem("historicoSenhas") || "[]");
    if (historico.length === 0) {
        const li = document.createElement("li");
        li.textContent = "Nenhuma senha gerada ainda.";
        lista.appendChild(li);
    }
    else {
        historico.slice(-10).reverse().forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            lista.appendChild(li);
        });
    }
};
btnExibir.addEventListener("click", () => {
    historico();
    dialog.showModal();
});
btnFechar.addEventListener("click", () => {
    dialog.close();
});
btnLimpar.addEventListener("click", () => {
    localStorage.removeItem("historicoSenhas");
    historico();
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
    const titulo = inputTitulo.value || "Sem título";
    const historico = JSON.parse(localStorage.getItem("historicoSenhas") || "[]");
    historico.push(`${titulo}: ${senha_p}`);
    localStorage.setItem("historicoSenhas", JSON.stringify(historico));
});
senha.addEventListener("touchstart", () => {
    senha.classList.add("hover-active");
});
senha.addEventListener("touchend", () => {
    senha.classList.remove("hover-active");
});
btn_gerador.addEventListener("touchstart", () => {
    btn_gerador.style.transform = 'scale(1.05)';
});
btn_gerador.addEventListener("touchend", () => {
    btn_gerador.style.transform = 'scale(1)';
});
const verifica_mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
btn_gerador.addEventListener("click", () => {
    if (verifica_mobile) {
        alert("Senha copiada para a área de transferência!");
        navigator.clipboard.writeText(senha.innerText).catch((err) => {
            alert("Erro ao copiar a senha!");
            console.error("Erro ao copiar a senha: ", err);
            sp_hov.classList.add("mobile");
        });
    }
});
senha.addEventListener("click", () => {
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
