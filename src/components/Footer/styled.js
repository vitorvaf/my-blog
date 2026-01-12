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
    padding: 0.75rem 1rem;
    margin-bottom: 3.5rem;
  `}
`

export const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
`

export const FooterText = styled.p`
  color: var(--texts);
  font-size: 0.8rem;
  line-height: 1.4;
  margin: 0;

  ${media.lessThan("large")`
    font-size: 0.7rem;
    line-height: 1.3;
  `}
`
