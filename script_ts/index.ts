const inputTitulo = document.querySelector("#titulo") as HTMLInputElement
const dialog = document.querySelector("#historico_dialog") as HTMLDialogElement
const btnExibir = document.querySelector("#btn_exibir_historico") as HTMLButtonElement
const btnFechar = document.querySelector("#btn_fechar") as HTMLButtonElement
const btnLimpar = document.querySelector("#btn_limpar_historico") as HTMLButtonElement
const lista = document.querySelector("#historico_lista") as HTMLUListElement
const campo_de_valor = document.querySelector("#Quantidade") as HTMLAnchorElement
let input_range = document.querySelector("#range") as HTMLInputElement
const btn_gerador = document.querySelector("#btn_gera_senha") as HTMLAnchorElement
const local_senha = document.querySelector("#local_senha") as HTMLAnchorElement
const txt_senha = document.querySelector("#txt_senha") as HTMLAnchorElement
let senha = document.querySelector("#senha") as HTMLAnchorElement
const sp_hov = document.querySelector("#sp_hov") as HTMLAnchorElement
let possibilidades:string = "qwertyuiopasdfghjklçzxcvbnm1234567890!@#$%¨&*()"
let nova_senha:string = ""


campo_de_valor.innerHTML = " " + input_range.value

input_range.addEventListener("input", function(this:HTMLInputElement):void {
     campo_de_valor.innerHTML = " " + this.value
})

const historico = ():void => {
  lista.innerHTML = ""
    const historico = JSON.parse(localStorage.getItem("historicoSenhas") || "[]")
    if (historico.length === 0) {
        const li = document.createElement("li")
        li.textContent = "Nenhuma senha gerada ainda."
        lista.appendChild(li)
    } else {
        historico.slice(-10).reverse().forEach((item: string) => {
            const li = document.createElement("li")
            li.textContent = item 
            lista.appendChild(li)
        })
    }
}


btnExibir.addEventListener("click", ():void => {
    historico()
    dialog.showModal()
})

btnFechar.addEventListener("click", ():void => {
    dialog.close()
})

btnLimpar.addEventListener("click", ():void => {
    localStorage.removeItem("historicoSenhas")
    historico()
})

btn_gerador.addEventListener("click", function():void {
     let senha_p:string = ""
     const val_input = parseInt(input_range.value)

     for (let i = 0; i < val_input; i++) {
         senha_p+= possibilidades.charAt(Math.floor(Math.random()* possibilidades.length))  
     }

    senha.innerHTML = senha_p

    if (senha === undefined || senha_p === "") {
        local_senha.classList.add("hide")
    }else{
        local_senha.classList.remove("hide")
    }

    const titulo = inputTitulo.value || "Sem título"
    const historico = JSON.parse(localStorage.getItem("historicoSenhas") || "[]")
    historico.push(`${titulo}: ${senha_p}`)
    localStorage.setItem("historicoSenhas", JSON.stringify(historico))
})

senha.addEventListener("touchstart", ():void => {
     senha.classList.add("hover-active")
})
senha.addEventListener("touchend", ():void => {
     senha.classList.remove("hover-active")
})
btn_gerador.addEventListener("touchstart", ():void => {
     btn_gerador.style.transform = 'scale(1.05)'     
})
btn_gerador.addEventListener("touchend", ():void => {
     btn_gerador.style.transform = 'scale(1)'
})


const verifica_mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)


btn_gerador.addEventListener("click", ():void => {
if (verifica_mobile) {
     alert("Senha copiada para a área de transferência!")
     navigator.clipboard.writeText(senha.innerText).catch((err)=>{
          alert("Erro ao copiar a senha!")
          console.error("Erro ao copiar a senha: ", err)
          sp_hov.classList.add("mobile")
     })
}
})

senha.addEventListener("click", ():void => {
     if (!verifica_mobile) {
          navigator.clipboard.writeText(senha.innerText)
     .then(() => {
          alert("Senha copiada para a área de transferência!")
     }).catch((err) => {
          alert("Erro ao copiar a senha!")
          console.error("Erro ao copiar a senha: ", err)
     })
     }
})