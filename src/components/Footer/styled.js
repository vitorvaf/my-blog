import styled from "styled-components"
import media from "styled-media-query"

export const FooterWrapper = styled.footer`
  background: var(--mediumBackground);
  border-top: 1px solid var(--borders);
  width: 100%;
  padding: 1.5rem 2rem;
  color: var(--texts);
  font-size: 0.8rem;
  margin-top: auto;

  ${media.lessThan("large")`
    padding: 1.25rem;
  `}
`

export const FooterContent = styled.div`
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  ${media.lessThan("large")`
    gap: 0.75rem;
  `}
`

export const FooterText = styled.p`
  color: var(--texts);
  font-size: 0.8rem;
  line-height: 1.4;
  margin: 0;
`

export const FooterLinks = styled.nav`
  display: flex;
  gap: 1.25rem;
  align-items: center;
`

export const FooterLink = styled.a`
  color: var(--texts);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`
