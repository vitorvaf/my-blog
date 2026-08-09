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
  min-height: calc(100vh - 120px);
  padding: 3rem 2rem 2rem;
  transition: background-color 0.2s ease, color 0.2s ease;
  width: 100%;
  margin: 0 auto;

  body#grid & {
    grid-template-areas:
      "posts"
      "pagination";
  }

  ${media.lessThan("large")`
    padding: 2rem 1.25rem 3rem;
  `}
`
