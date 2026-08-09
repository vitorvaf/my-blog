import styled from "styled-components"
import media from "styled-media-query"

import { Link } from "gatsby"

export const RecommendedWrapper = styled.section`
  border-bottom: 1px solid var(--borders);
  border-top: 1px solid var(--borders);
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  padding: 2rem 5rem;

  ${media.lessThan("large")`
    gap: 1rem;
    padding: 2rem 1rem;
  `}
`

export const RecommendedHeading = styled.h2`
  color: var(--postColor);
  grid-column: 1 / -1;
  margin: 0;
  font-size: 1.5rem;
`

export const RecommendedLink = styled(Link)`
  align-items: flex-start;
  background: transparent;
  color: var(--highlight);
  display: flex;
  flex-direction: column;
  padding: 0;
  text-decoration: none;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }

  &.next {
    align-items: flex-end;
    text-align: right;
  }
`

export const RecommendedTitle = styled.span`
  font-weight: 600;
`

export const RecommendedMeta = styled.span`
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  margin-top: 0.5rem;
`
