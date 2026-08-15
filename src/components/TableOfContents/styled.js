import styled from "styled-components"
import media from "styled-media-query"

// Desktop nav container. Lives inside the sticky <aside> on desktop and
// disappears on mobile (where the disclosure variant takes over).
export const TOCWrapper = styled.nav`
  background: transparent;
  border: 0;
  border-left: 2px solid var(--borders);
  border-radius: 0;
  padding: 0.25rem 0 0.25rem 1rem;
  margin: 0;

  /* On desktop, allow long TOC lists to scroll internally so the sidebar
     never out-grows the viewport. The scrollbar is hidden to avoid jank. */
  max-height: calc(100vh - 6.5rem);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--borders) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--borders);
    border-radius: 3px;
  }

  ${media.lessThan("large")`
    display: none;
  `}
`

export const TOCTitle = styled.span`
  display: block;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
  margin: 0 0 0.5rem 0;
  padding: 0;
`

export const TOCList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
`

export const TOCItem = styled.li`
  margin: 0;
  padding: 0;
  padding-left: ${props => (props.level === 3 ? "1rem" : "0")};
`

// Active item gets a darker left-border segment that visually extends the
// wrapper's border. Inactive items get a transparent segment of equal
// width to keep text alignment consistent.
// `&&` doubles the class specificity so these colors beat the generic
// `MainContent a { color: var(--highlight) }` rule (the mobile variant
// renders inside MainContent).
export const TOCLink = styled.a`
  && {
    color: ${props => (props.isActive ? "var(--highlight)" : "var(--muted)")};
    text-decoration: none;

    &:hover {
      color: var(--highlight);
      opacity: 1;
    }
  }

  display: block;
  padding: 0.35rem 0 0.35rem 0.75rem;
  margin-left: -0.75rem;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  line-height: 1.4;
  border-left: 2px solid
    ${props => (props.isActive ? "var(--highlight)" : "transparent")};
  transition: color 0.2s, border-left-color 0.2s;
`

// --- Mobile disclosure (details/summary) ---------------------------------
// Renders only on small viewports; hidden on desktop.

export const MobileTOCWrapper = styled.details`
  display: block;
  background: transparent;
  border: 1px solid var(--borders);
  border-radius: 8px;
  padding: 0.5rem 1rem 1rem;
  margin: 0 0 2rem 0;

  ${media.greaterThan("large")`
    display: none;
  `}
`

export const MobileTOCSummary = styled.summary`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  list-style: none;
  cursor: pointer;
  user-select: none;
  padding: 0.5rem 0;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);

  &::-webkit-details-marker {
    display: none;
  }

  &::marker {
    content: "";
  }

  &::after {
    content: "";
    width: 0.5rem;
    height: 0.5rem;
    border-right: 1.5px solid var(--muted);
    border-bottom: 1.5px solid var(--muted);
    transform: rotate(45deg);
    transition: transform 0.2s ease;
  }

  details[open] > &::after {
    transform: rotate(-135deg);
  }

  &:focus-visible {
    outline: 2px solid var(--highlight);
    outline-offset: 2px;
    border-radius: 2px;
  }
`

export const MobileTOCList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0;
  border-left: 2px solid var(--borders);
  padding-left: 1rem;
`

export const MobileTOCItem = styled.li`
  margin: 0;
  padding: 0;
  padding-left: ${props => (props.level === 3 ? "1rem" : "0")};
`

// '&&' beats the generic MainContent 'a' link styling this list nests in.
export const MobileTOCLink = styled.a`
  && {
    color: ${props => (props.isActive ? "var(--highlight)" : "var(--muted)")};
    text-decoration: none;

    &:hover {
      color: var(--highlight);
      opacity: 1;
    }
  }

  display: block;
  padding: 0.35rem 0;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  line-height: 1.4;
  border-left: 2px solid
    ${props => (props.isActive ? "var(--highlight)" : "transparent")};
  padding-left: 0.75rem;
  margin-left: -0.75rem;
  transition: color 0.2s, border-left-color 0.2s;
`
