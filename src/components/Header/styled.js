import styled from "styled-components"
import { Link } from "gatsby"
import media from "styled-media-query"

export const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1rem 2rem;
  background: rgba(17, 17, 17, 0.9);
  background: var(--background);
  background: color-mix(in srgb, var(--background) 90%, transparent);
  border-bottom: 1px solid var(--borders);
  backdrop-filter: blur(8px);

  ${media.lessThan("large")`
    padding: 1rem 1.25rem;
  `}

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

export const Wordmark = styled(Link)`
  color: var(--postColor);
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 1.05rem;
  }
`

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.75rem;

  ${media.lessThan("large")`
    gap: 1rem;
    font-size: 0.9rem;
  `}

  @media (max-width: 768px) {
    gap: 0.85rem;

    > a {
      font-size: 0.8rem;
    }
  }
`

export const NavLink = styled(Link)`
  color: var(--texts);
  text-decoration: none;

  &:hover {
    opacity: 1;
    text-decoration: underline;
  }
`

export const ExternalNavLink = styled.a`
  color: var(--texts);
  text-decoration: none;

  &:hover {
    opacity: 1;
    text-decoration: underline;
  }
`

export const SearchTrigger = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.4rem 0.65rem;
  color: var(--texts);
  font: inherit;
  font-size: 0.875rem;
  background: transparent;
  border: 1px solid var(--borders);
  border-radius: 999px;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    color: var(--highlight);
    outline: 0;
  }

  svg {
    width: 1rem;
    height: 1rem;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.75;
  }

  @media (max-width: 768px) {
    padding: 0.4rem;
  }
`

export const SearchTriggerText = styled.span`
  @media (max-width: 768px) {
    display: none;
  }
`

export const SearchShortcut = styled.kbd`
  padding: 2px 4px;
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  line-height: 1;
  border: 1px solid var(--borders);
  border-radius: 3px;

  @media (max-width: 768px) {
    display: none;
  }
`

export const ThemeToggle = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  color: var(--texts);
  background: transparent;
  border: 0;
  cursor: pointer;

  svg {
    width: 1.1rem;
    height: 1.1rem;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.75;
  }
`
