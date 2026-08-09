import React, { useCallback, useEffect, useRef, useState } from "react"
import { navigate } from "gatsby"

import { runSearch } from "../../utils/pagefind"
import * as S from "./styled"

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </svg>
)

const SearchPalette = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [selected, setSelected] = useState(-1)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const previousFocusRef = useRef(null)

  const openPalette = useCallback(() => {
    if (!isOpen && typeof document !== "undefined") {
      previousFocusRef.current = document.activeElement
    }
    setIsOpen(true)
    setQuery("")
    setResults([])
    setSelected(-1)
  }, [isOpen])

  const closePalette = useCallback(() => {
    setIsOpen(false)
    setLoading(false)

    if (
      previousFocusRef.current &&
      typeof previousFocusRef.current.focus === "function"
    ) {
      previousFocusRef.current.focus()
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return undefined

    const handleShortcut = event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        openPalette()
      } else if (event.key === "Escape" && isOpen) {
        event.preventDefault()
        closePalette()
      }
    }
    const handleOpenSearch = () => openPalette()

    window.addEventListener("keydown", handleShortcut)
    window.addEventListener("open-search", handleOpenSearch)

    return () => {
      window.removeEventListener("keydown", handleShortcut)
      window.removeEventListener("open-search", handleOpenSearch)
    }
  }, [closePalette, isOpen, openPalette])

  useEffect(() => {
    if (!isOpen) return undefined

    const timer = window.setTimeout(async () => {
      if (!query.trim()) {
        setResults([])
        setLoading(false)
        return
      }

      setLoading(true)
      const nextResults = await runSearch(query)
      setResults(nextResults)
      setSelected(-1)
      setLoading(false)
    }, 150)

    return () => window.clearTimeout(timer)
  }, [isOpen, query])

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus()
  }, [isOpen])

  const goToResult = result => {
    closePalette()
    navigate(result.url)
  }

  const handleInputKeyDown = event => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setSelected(current => Math.min(results.length - 1, current + 1))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setSelected(current => Math.max(-1, current - 1))
    } else if (event.key === "Enter" && selected >= 0 && results[selected]) {
      event.preventDefault()
      goToResult(results[selected])
    }
  }

  if (!isOpen) return null

  return (
    <S.Backdrop
      onClick={event => event.target === event.currentTarget && closePalette()}
    >
      <S.Panel role="dialog" aria-modal="true" aria-label="Buscar artigos">
        <S.SearchRow>
          <SearchIcon />
          <S.SearchInput
            ref={inputRef}
            type="search"
            value={query}
            placeholder="Buscar artigos…"
            aria-label="Buscar artigos"
            onChange={event => setQuery(event.target.value)}
            onKeyDown={handleInputKeyDown}
          />
          <S.Shortcut>esc</S.Shortcut>
        </S.SearchRow>
        <S.Results role="listbox" aria-label="Resultados da busca">
          {loading && <S.Status>Buscando…</S.Status>}
          {!loading && query.trim() && results.length === 0 && (
            <S.Status>Nenhum resultado.</S.Status>
          )}
          {results.map((result, index) => (
            <S.ResultRow
              key={result.url}
              type="button"
              role="option"
              aria-selected={selected === index}
              $selected={selected === index}
              onMouseEnter={() => setSelected(index)}
              onClick={() => goToResult(result)}
            >
              <S.ResultTitle $selected={selected === index}>
                {result.title}
              </S.ResultTitle>
              {(result.description || result.excerpt) && (
                <S.ResultMeta>
                  {result.description || result.excerpt}
                </S.ResultMeta>
              )}
            </S.ResultRow>
          ))}
        </S.Results>
        <S.FooterHint>
          <S.DesktopHint>↑↓ navegar · ↴ abrir · esc fechar</S.DesktopHint>
          <S.MobileHint>Toque em um resultado para abrir</S.MobileHint>
        </S.FooterHint>
      </S.Panel>
    </S.Backdrop>
  )
}

export default SearchPalette
