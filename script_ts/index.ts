// --- Referências DOM ---

// Controles de Senha
const inputRange = document.querySelector("#range") as HTMLInputElement
const displayQuantidade = document.querySelector("#Quantidade") as HTMLSpanElement
const btnGerador = document.querySelector("#btn_gera_senha") as HTMLButtonElement
const inputTitulo = document.querySelector("#titulo") as HTMLInputElement

// Opções de Caracteres (Novos IDs)
const inputMaiusculas = document.querySelector("#uppercase") as HTMLInputElement
const inputMinusculas = document.querySelector("#lowercase") as HTMLInputElement
const inputNumeros = document.querySelector("#numbers") as HTMLInputElement
const inputSimbolos = document.querySelector("#symbols") as HTMLInputElement

// Exibição de Senha
const localSenha = document.querySelector("#local_senha") as HTMLElement
const senhaDisplay = document.querySelector("#senha") as HTMLSpanElement
const strengthBar = document.querySelector("#strength_bar") as HTMLElement
const strengthText = document.querySelector("#strength_text") as HTMLElement

// Histórico e Diálogo
const btnExibirHistorico = document.querySelector("#btn_exibir_historico") as HTMLButtonElement
const dialogHistorico = document.querySelector("#historico_dialog") as HTMLDialogElement
const btnFechar = document.querySelector("#btn_fechar") as HTMLButtonElement
const btnLimpar = document.querySelector("#btn_limpar_historico") as HTMLButtonElement
const listaHistorico = document.querySelector("#historico_lista") as HTMLUListElement

// Toast Notification
const toastElement = document.querySelector("#toast") as HTMLElement
const toastMessage = document.querySelector("#toast_message") as HTMLSpanElement
const toastIcon = document.querySelector(".toast-icon") as SVGElement

// --- Constantes de Caracteres ---

const MAIUSCULAS: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const MINUSCULAS: string = "abcdefghijklmnopqrstuvwxyz"
const NUMEROS: string = "0123456789"
const SIMBOLOS: string = "!@#$%^&*()_+-=[]{}|;':\",./<>?`~"

// --- Funções Auxiliares ---

/** Atualiza o valor do range exibido */
inputRange.addEventListener("input", function(this: HTMLInputElement): void {
    displayQuantidade.innerHTML = this.value
})

/** Embaralha um array (Algoritmo Fisher-Yates) */
function shuffleArray(array: string[]): string[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

// --- Indicador de Força (Lógica de Força da Senha) ---

interface StrengthResult {
    score: number;
    text: string;
    class: string;
}

/**
 * Calcula a força da senha com base em critérios.
 * @param password A senha gerada.
 * @returns Um objeto com a pontuação, texto e classe CSS.
 */
function checkPasswordStrength(password: string): StrengthResult {
    let score = 0
    const length = password.length
    const hasLower = /[a-z]/.test(password)
    const hasUpper = /[A-Z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)

    // Critérios baseados na complexidade e comprimento (Lógica Zxcvbn simplificada)
    if (length >= 8) score += 1
    if (length >= 12) score += 1
    if (length >= 16) score += 1
    
    let complexity = 0
    if (hasLower) complexity++
    if (hasUpper) complexity++
    if (hasNumber) complexity++
    if (hasSymbol) complexity++

    score += complexity > 1 ? complexity : 0

    // Mapeamento do resultado
    if (score < 4) {
        return { score: 1, text: "Fraca", class: "strength-weak" }
    } else if (score < 7) {
        return { score: 2, text: "Média", class: "strength-medium" }
    } else {
        return { score: 3, text: "Forte", class: "strength-strong" }
    }
}

/** Atualiza a barra e o texto do indicador de força */
function updateStrengthIndicator(password: string): void {
    const result = checkPasswordStrength(password)
    
    // Remove classes anteriores e adiciona a nova
    strengthBar.className = 'strength-bar'
    strengthBar.classList.add(result.class)
    
    // Atualiza o texto
    strengthText.textContent = `Força: ${result.text}`
    strengthText.className = 'strength-text'
    strengthText.classList.add(result.class.replace('strength-', 'text-'))
    
    // Garante que a barra apareça
    if (!localSenha.classList.contains("show")) {
        localSenha.classList.add("show")
    }
}

// --- Geração de Senha (Lógica Principal) ---

btnGerador.addEventListener("click", function(): void {
    const valInput = parseInt(inputRange.value)
    let possibilidades: string = ""
    let tempSenha: string = ""
    let numCaracteresRestantes = valInput
    let tiposSelecionados: number = 0

    // 1. Constrói a pool de caracteres e garante pelo menos um de cada tipo selecionado
    if (inputMaiusculas.checked) {
        possibilidades += MAIUSCULAS
        tempSenha += MAIUSCULAS.charAt(Math.floor(Math.random() * MAIUSCULAS.length))
        numCaracteresRestantes--
        tiposSelecionados++
    }
    if (inputMinusculas.checked) {
        possibilidades += MINUSCULAS
        tempSenha += MINUSCULAS.charAt(Math.floor(Math.random() * MINUSCULAS.length))
        numCaracteresRestantes--
        tiposSelecionados++
    }
    if (inputNumeros.checked) {
        possibilidades += NUMEROS
        tempSenha += NUMEROS.charAt(Math.floor(Math.random() * NUMEROS.length))
        numCaracteresRestantes--
        tiposSelecionados++
    }
    if (inputSimbolos.checked) {
        possibilidades += SIMBOLOS
        tempSenha += SIMBOLOS.charAt(Math.floor(Math.random() * SIMBOLOS.length))
        numCaracteresRestantes--
        tiposSelecionados++
    }

    // Validação
    if (tiposSelecionados === 0) {
        showToast("Selecione pelo menos um tipo de caractere!", "error")
        senhaDisplay.innerHTML = ""
        localSenha.classList.remove("show")
        return
    }

    // 2. Preenche os caracteres restantes
    for (let i = 0; i < numCaracteresRestantes; i++) {
        tempSenha += possibilidades.charAt(Math.floor(Math.random() * possibilidades.length))
    }

    // 3. Embaralha a senha final
    let senhaArray = tempSenha.split('')
    const senhaFinal = shuffleArray(senhaArray).join('')

    // 4. Exibe a senha e atualiza o indicador de força
    senhaDisplay.innerHTML = senhaFinal
    localSenha.classList.add("show")
    updateStrengthIndicator(senhaFinal)

    // 5. Salva no histórico (só se for diferente da última senha, para evitar spam)
    const titulo = inputTitulo.value || "Sem título"
    const historicoArray = JSON.parse(localStorage.getItem("historicoSenhas") || "[]")
    
    // Verifica se a última senha salva é a mesma
    const ultimaSenha = historicoArray.length > 0 ? historicoArray[historicoArray.length - 1].split(': ')[1] : ''
    
    if (senhaFinal !== ultimaSenha) {
        historicoArray.push(`${titulo}: ${senhaFinal}`)
        localStorage.setItem("historicoSenhas", JSON.stringify(historicoArray))
    }
})

// --- Histórico e Eventos de UI ---

/** Exibe o histórico de senhas */
const historico = (): void => {
    listaHistorico.innerHTML = ""
    const historicoArray = JSON.parse(localStorage.getItem("historicoSenhas") || "[]")
    
    if (historicoArray.length === 0) {
        const li = document.createElement("li")
        li.textContent = "Nenhuma senha gerada ainda."
        li.style.cursor = "default"
        li.style.textAlign = "center"
        listaHistorico.appendChild(li)
    } else {
        // Exibe os últimos 15, em ordem do mais recente para o mais antigo
        historicoArray.slice(-15).reverse().forEach((item: string) => {
            const li = document.createElement("li")
            li.textContent = item
            li.addEventListener('click', () => {
                const senhaParaCopiar = item.split(': ')[1]
                if (senhaParaCopiar) copiarSenha(senhaParaCopiar)
            })
            listaHistorico.appendChild(li)
        })
    }
}

btnExibirHistorico.addEventListener("click", (): void => {
    historico()
    dialogHistorico.showModal()
})

btnFechar.addEventListener("click", (): void => {
    dialogHistorico.close()
})

btnLimpar.addEventListener("click", (): void => {
    localStorage.removeItem("historicoSenhas")
    historico()
    showToast("Histórico limpo com sucesso!", "success")
})

// --- Toast e Cópia ---

/** Exibe a notificação Toast */
function showToast(message: string, type: 'success' | 'error'): void {
    toastMessage.textContent = message
    toastElement.classList.remove('show', 'error')
    
    if (type === 'error') {
        toastElement.classList.add('error')
        toastIcon.innerHTML = `<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>`
    } else {
        toastIcon.innerHTML = `<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>`
    }

    setTimeout(() => {
        toastElement.classList.add('show')
    }, 100)
    
    setTimeout(() => {
        toastElement.classList.remove('show')
    }, 3000)
}

/** Copia a senha para a área de transferência */
const copiarSenha = (texto: string): void => {
    navigator.clipboard.writeText(texto)
        .then(() => {
            showToast("Senha copiada para a área de transferência!", "success")
        })
        .catch((err) => {
            console.error("Erro ao copiar a senha: ", err)
            showToast("Erro ao copiar. Tente novamente!", "error")
        })
}

// Copia ao clicar na senha exibida
senhaDisplay.addEventListener("click", (): void => {
    if (senhaDisplay.innerText) {
        copiarSenha(senhaDisplay.innerText)
    }
})

// --- Service Worker (PWA) ---

async function registrarServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registro = await navigator.serviceWorker.register('./service_worker.js')
            console.log('✅ Service Worker registrado com sucesso!', registro)
        } catch (erro) {
            console.error('❌ Erro ao registrar Service Worker:', erro)
        }
    }
}

// --- Feedback Visual para Filtros ---

/** Adiciona feedback visual quando filtros são alterados */
function addFilterFeedback(): void {
    const checkboxes = [inputMaiusculas, inputMinusculas, inputNumeros, inputSimbolos]
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function(): void {
            const wrapper = this.closest('.option-group') as HTMLElement
            const label = wrapper.querySelector('.option-label') as HTMLElement
            
            if (this.checked) {
                wrapper.style.transform = 'scale(1.02)'
                label.style.color = 'var(--primary-light)'
                label.style.textShadow = '0 0 10px rgba(0, 255, 65, 0.8)'
                showToast(`${label.textContent} ativado!`, 'success')
            } else {
                wrapper.style.transform = 'scale(1)'
                label.style.color = 'var(--text-secondary)'
                label.style.textShadow = '0 0 5px rgba(0, 255, 65, 0.3)'
                showToast(`${label.textContent} desativado!`, 'error')
            }
            
            setTimeout(() => {
                wrapper.style.transform = 'scale(1)'
            }, 200)
        })
    })
}

document.addEventListener('DOMContentLoaded', (): void => {
    registrarServiceWorker()
    addFilterFeedback()
})