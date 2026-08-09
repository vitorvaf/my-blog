import styled from "styled-components"
import media from "styled-media-query"

export const TOCWrapper = styled.nav`
  background: transparent;
  border: 0;
  border-left: 2px solid var(--borders);
  border-radius: 0;
  padding: 0.25rem 0 0.25rem 1rem;
  margin: 0 0 2.5rem 0;

  ${media.lessThan("large")`
    margin-bottom: 2rem;
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

export const TOCLink = styled.a`
  display: block;
  padding: 0.35rem 0;
  color: ${props => (props.isActive ? "var(--highlight)" : "var(--muted)")};
  text-decoration: none;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  line-height: 1.4;
  border-bottom: none;
  transition: color 0.2s;

  &:hover {
    color: var(--highlight);
    opacity: 1;
  }
`
