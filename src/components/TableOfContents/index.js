import React, { useEffect, useState } from "react"
import * as S from "./styled"

const TableOfContents = () => {
  const [headings, setHeadings] = useState([])
  const [activeId, setActiveId] = useState("")

  useEffect(() => {
    // Só executa no browser
    if (typeof window === "undefined") return

    // Extrai headings do conteúdo
    const article = document.querySelector(".post-content")
    if (!article) return

    const headingElements = article.querySelectorAll("h2, h3")
    const headingData = Array.from(headingElements).map((heading, index) => {
      // Adiciona ID ao heading se não tiver
      if (!heading.id) {
        heading.id = `heading-${index}`
      }

      return {
        id: heading.id,
        text: heading.textContent,
        level: parseInt(heading.tagName.substring(1)),
      }
    })

    setHeadings(headingData)

    // Observer para marcar heading ativo
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "-20% 0px -80% 0px" }
    )

    headingElements.forEach(heading => observer.observe(heading))

    return () => observer.disconnect()
  }, [])

  if (headings.length === 0) return null

  return (
    <S.TOCWrapper aria-label="Neste artigo">
      <S.TOCTitle>Neste artigo</S.TOCTitle>
      <S.TOCList>
        {headings.map(heading => (
          <S.TOCItem key={heading.id} level={heading.level}>
            <S.TOCLink
              href={`#${heading.id}`}
              isActive={activeId === heading.id}
              onClick={e => {
                e.preventDefault()
                const element = document.getElementById(heading.id)
                if (element) {
                  element.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
                }
              }}
            >
              {heading.text}
            </S.TOCLink>
          </S.TOCItem>
        ))}
      </S.TOCList>
    </S.TOCWrapper>
  )
}

export default TableOfContents
