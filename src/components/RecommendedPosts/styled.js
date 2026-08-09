import styled from "styled-components"
import media from "styled-media-query"

import { Link } from "gatsby"

export const RecommendedWrapper = styled.section`
  width: 100%;
  padding: 0;
  padding-top: 2rem;
  margin-top: 3rem;
  border-top: 1px solid var(--borders);
  border-bottom: 0;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  ${media.lessThan("large")`
    margin-top: 2.5rem;
    gap: 1rem;
  `}
`

export const RecommendedHeading = styled.h2`
  color: var(--muted);
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin: 0 0 0.5rem 0;
`

export const RecommendedLink = styled(Link)`
  align-items: flex-start;
  background: transparent;
  color: var(--postColor);
  display: flex;
  flex-direction: column;
  padding: 0;
  text-decoration: none;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
`

export const RecommendedTitle = styled.span`
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 1.0625rem;
  color: var(--postColor);
`

export const RecommendedMeta = styled.span`
  color: var(--muted);
  font-family: var(--font-body);
  font-size: 0.8125rem;
  margin-top: 0.25rem;
`
