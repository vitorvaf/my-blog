import styled from "styled-components"

export const SkipLink = styled.a`
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--highlight);
  color: var(--background);
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  font-weight: 600;
  z-index: 9999;
  border-radius: 0 0 4px 0;
  transition: top 0.3s;

  &:focus {
    top: 0;
    outline: 2px solid var(--background);
    outline-offset: 2px;
  }
`
