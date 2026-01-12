import styled from "styled-components"
import media from "styled-media-query"

export const FooterWrapper = styled.footer`
  background: var(--mediumBackground);
  border-top: 1px solid var(--borders);
  width: 100%;
  padding: 1rem 2rem;
  transition: background 0.3s;
  margin-top: auto;

  ${media.lessThan("large")`
    display: none;
  `}
`

export const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

export const FooterText = styled.p`
  color: var(--texts);
  font-size: 0.8rem;
  line-height: 1.4;
  margin: 0;
`
