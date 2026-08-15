import React, { useEffect, useState } from "react"
import * as S from "./styled"

// Tracks h2/h3 inside `.post-content` and reports which heading is currently
// "active" (the topmost one crossing the upper portion of the viewport).
// Shared by both the sticky desktop sidebar and the inline mobile disclosure.
const useTOCHeadings = () => {
  const [headings, setHeadings] = useState([])
  const [activeId, setActiveId] = useState("")

  useEffect(() => {
    // Só executa no browser
    if (typeof window === "undefined") return undefined

    const article = document.querySelector(".post-content")
    if (!article) return undefined

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

    if (headingData.length === 0) return undefined

    // At the very top of the page no heading crossed the active band yet,
    // so seed the highlight with the first section (the reader is "in" the
    // article intro heading toward it). The observer takes over on scroll.
    setActiveId(headingData[0].id)

    // The IntersectionObserver treats a thin band near the top of the
    // viewport as the "active" zone (clears the sticky header + breathing
    // room). When a heading enters that band it becomes the active section;
    // if multiple are visible at once we keep the uppermost one so it reads
    // naturally while scrolling both up and down.
    const observer = new IntersectionObserver(
      entries => {
        const intersecting = entries.filter(entry => entry.isIntersecting)
        if (intersecting.length === 0) return

        // Pick the heading closest to the top of the active band.
        const topmost = intersecting.reduce((acc, entry) => {
          if (!acc) return entry
          return entry.boundingClientRect.top < acc.boundingClientRect.top
            ? entry
            : acc
        }, null)

        if (topmost) setActiveId(topmost.target.id)
      },
      {
        // Top margin accounts for the sticky header (~64px ≈ 4rem) plus
        // breathing room; bottom margin pulls the active zone up so the
        // next section only becomes active once it has clearly scrolled in.
        // NOTE: rootMargin only accepts px/% — rem throws a SyntaxError.
        rootMargin: "-80px 0px -65% 0px",
        threshold: 0,
      }
    )

    headingElements.forEach(heading => observer.observe(heading))

    return () => observer.disconnect()
  }, [])

  return { headings, activeId }
}

// Smoothly scrolls to a heading while honoring its `scroll-margin-top` so it
// doesn't hide behind the sticky site header.
const scrollToHeading = id => {
  if (typeof document === "undefined") return
  const element = document.getElementById(id)
  if (!element) return
  element.scrollIntoView({ behavior: "smooth", block: "start" })
}

const renderList = (headings, activeId, onClick, Item, Link) =>
  headings.map(heading => (
    <Item key={heading.id} level={heading.level}>
      <Link
        href={`#${heading.id}`}
        isActive={activeId === heading.id}
        onClick={e => {
          e.preventDefault()
          scrollToHeading(heading.id)
          if (onClick) onClick(heading.id)
        }}
      >
        {heading.text}
      </Link>
    </Item>
  ))

const TableOfContents = ({ variant = "desktop" }) => {
  const { headings, activeId } = useTOCHeadings()

  if (headings.length === 0) return null

  if (variant === "mobile") {
    return (
      <S.MobileTOCWrapper>
        <S.MobileTOCSummary>Neste artigo</S.MobileTOCSummary>
        <S.MobileTOCList>
          {renderList(
            headings,
            activeId,
            null,
            S.MobileTOCItem,
            S.MobileTOCLink
          )}
        </S.MobileTOCList>
      </S.MobileTOCWrapper>
    )
  }

  return (
    <S.TOCWrapper aria-label="Neste artigo">
      <S.TOCTitle>Neste artigo</S.TOCTitle>
      <S.TOCList>
        {renderList(headings, activeId, null, S.TOCItem, S.TOCLink)}
      </S.TOCList>
    </S.TOCWrapper>
  )
}

export default TableOfContents
