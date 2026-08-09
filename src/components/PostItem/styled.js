import styled from "styled-components"
import { Link } from "gatsby"

export const PostItemLink = styled(Link)`
  border-top: 1px solid var(--borders);
  color: var(--texts);
  display: block;
  padding: 1.25rem 0;
  text-decoration: none;
  width: 100%;

  &:focus-visible {
    outline: 2px solid var(--highlight);
    outline-offset: 4px;
  }
`

export const PostItemTitle = styled.h2`
  color: var(--postColor);
  font-family: var(--font-display);
  font-size: 1.375rem;
  font-weight: 600;
  line-height: 1.3;
  margin: 0;
`

export const PostItemMeta = styled.p`
  color: var(--muted);
  font-size: 0.8125rem;
  margin: 0.35rem 0 0;
`

export const PostItemDescription = styled.p`
  color: var(--texts);
  font-size: 0.9375rem;
  line-height: 1.5;
  margin: 0.25rem 0 0;
`
