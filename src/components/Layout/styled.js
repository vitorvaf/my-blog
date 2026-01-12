import styled from "styled-components"
import media from "styled-media-query"

export const LayoutWrapper = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  ${media.lessThan("large")`
    flex-direction: column;
  `}
`

export const LayoutMain = styled.main`
  background: var(--background);
  flex: 1;
  padding: 6rem 6rem 2rem 2rem;
  transition: background 0.3s, color 0.3s;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;

  body#grid & {
    grid-template-areas:
      "posts"
      "pagination";
  }

  ${media.lessThan("large")`
    padding: 6rem 1rem 5rem 1rem;
  `}
`
