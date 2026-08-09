import React, { useEffect, useState } from "react"

import * as S from "./styled"

const ThemeIcon = ({ theme }) =>
  theme === "dark" ? (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z" />
    </svg>
  )

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </svg>
)

const Header = () => {
  const [theme, setTheme] = useState("dark")

  useEffect(() => {
    if (typeof window === "undefined") return undefined

    setTheme(window.__theme)
    const handleThemeChange = newTheme => setTheme(newTheme)
    window.__onThemeChange = handleThemeChange

    return () => {
      if (window.__onThemeChange === handleThemeChange) {
        window.__onThemeChange = function () {}
      }
    }
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark"
    window.__setPreferredTheme(nextTheme)
    setTheme(nextTheme)
  }

  return (
    <S.HeaderWrapper>
      <S.Wordmark to="/">Vitor Abreu</S.Wordmark>
      <S.Nav aria-label="Navegação principal">
        <S.NavLink to="/">Writing</S.NavLink>
        <S.NavLink to="/about">About</S.NavLink>
        <S.ExternalNavLink
          href="https://github.com/vitorvaf"
          rel="noopener noreferrer"
        >
          GitHub
        </S.ExternalNavLink>
        <S.SearchTrigger
          type="button"
          aria-label="Buscar"
          aria-keyshortcuts="⌘K"
          onClick={() => window.dispatchEvent(new Event("open-search"))}
        >
          <SearchIcon />
          <S.SearchTriggerText>Search</S.SearchTriggerText>
          <S.SearchShortcut>⌘K</S.SearchShortcut>
        </S.SearchTrigger>
        <S.ThemeToggle
          type="button"
          aria-label="Alternar tema"
          onClick={toggleTheme}
        >
          <ThemeIcon theme={theme} />
        </S.ThemeToggle>
      </S.Nav>
    </S.HeaderWrapper>
  )
}

export default Header
