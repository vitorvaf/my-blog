import { useEffect } from "react"

const languageAliases = {
  bash: "bash",
  javascript: "javascript",
  js: "javascript",
  sh: "bash",
}

const getLanguage = block => {
  const languageClass = Array.from(block.classList).find(className =>
    className.startsWith("language-")
  )
  const language = languageClass
    ? languageClass.replace("language-", "")
    : "text"

  return languageAliases[language] || language
}

const CodeCopyButton = () => {
  useEffect(() => {
    if (typeof window === "undefined") return

    const addCopyButtons = () => {
      const codeBlocks = document.querySelectorAll("pre[class*='language-']")

      codeBlocks.forEach(block => {
        if (
          block.previousElementSibling?.classList.contains("code-block-header")
        ) {
          return
        }

        const button =
          block.querySelector(".copy-code-button") ||
          document.createElement("button")
        const header = document.createElement("div")
        const languageLabel = document.createElement("span")

        header.className = "code-block-header"
        header.style.alignItems = "center"
        header.style.background = "var(--mediumBackground)"
        header.style.border = "1px solid var(--borders)"
        header.style.borderBottom = "0"
        header.style.borderRadius = "8px 8px 0 0"
        header.style.boxSizing = "border-box"
        header.style.color = "var(--texts)"
        header.style.display = "flex"
        header.style.justifyContent = "space-between"
        header.style.padding = "0.5rem 0.75rem"

        languageLabel.textContent = getLanguage(block)
        languageLabel.style.color = "var(--muted)"
        languageLabel.style.fontFamily = "var(--font-mono)"
        languageLabel.style.fontSize = "0.75rem"
        header.appendChild(languageLabel)

        button.className = "copy-code-button"
        button.textContent = "Copiar"
        button.setAttribute("aria-label", "Copiar código")
        button.style.position = "static"
        button.style.top = "auto"
        button.style.right = "auto"

        header.appendChild(button)
        block.parentNode.insertBefore(header, block)
        block.style.borderTopLeftRadius = "0"
        block.style.borderTopRightRadius = "0"

        if (button.dataset.copyHandlerAttached) return

        button.addEventListener("click", async () => {
          try {
            const code = block.querySelector("code").textContent
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
        button.dataset.copyHandlerAttached = "true"
      })
    }

    addCopyButtons()
  }, [])

  return null
}

export default CodeCopyButton
