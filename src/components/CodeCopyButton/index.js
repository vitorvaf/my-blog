import { useEffect } from "react"

const CodeCopyButton = () => {
  useEffect(() => {
    // Adiciona botão de copiar a todos os blocos de código
    const addCopyButtons = () => {
      const codeBlocks = document.querySelectorAll("pre[class*='language-']")
      
      codeBlocks.forEach((block) => {
        // Evita adicionar múltiplos botões
        if (block.querySelector(".copy-code-button")) return

        const button = document.createElement("button")
        button.className = "copy-code-button"
        button.textContent = "Copiar"
        button.setAttribute("aria-label", "Copiar código")
        
        button.addEventListener("click", async () => {
          const code = block.querySelector("code").textContent
          
          try {
            await navigator.clipboard.writeText(code)
            button.textContent = "Copiado!"
            button.classList.add("copied")
            
            setTimeout(() => {
              button.textContent = "Copiar"
              button.classList.remove("copied")
            }, 2000)
          } catch (err) {
            button.textContent = "Erro"
            setTimeout(() => {
              button.textContent = "Copiar"
            }, 2000)
          }
        })
        
        block.style.position = "relative"
        block.appendChild(button)
      })
    }

    // Executa quando o DOM estiver pronto
    addCopyButtons()
  }, [])

  return null
}

export default CodeCopyButton
