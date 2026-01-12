import styled from "styled-components"
import media from "styled-media-query"

export const TOCWrapper = styled.nav`
  background: var(--mediumBackground);
  border: 1px solid var(--borders);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  
  ${media.lessThan("large")`
    padding: 1rem;
    margin-bottom: 1.5rem;
  `}
`

export const TOCTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--postColor);
  margin: 0 0 1rem 0;
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
  padding: 0.5rem 0;
  color: ${props => (props.isActive ? "var(--highlight)" : "var(--texts)")};
  text-decoration: none;
  font-size: 0.9rem;
  line-height: 1.4;
  border-bottom: none;
  transition: all 0.2s;
  border-left: 2px solid ${props => (props.isActive ? "var(--highlight)" : "transparent")};
  padding-left: ${props => (props.isActive ? "0.5rem" : "0")};

  &:hover {
    color: var(--highlight);
    opacity: 1;
  }
`
