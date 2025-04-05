import styled from "styled-components"
import media from "styled-media-query"

export const LayoutWrapper = styled.section`
  display: flex;

  ${media.lessThan("large")`
    flex-direction: columm;
  `}
`

export const LayoutMain = styled.main`
  background: var(--background);
  min-height: 100vh;
  padding: 6rem 0 2rem 0;
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
    padding: 3rem 1rem 2rem 1rem;
  `}
`
