import styled from "styled-components"
import media from "styled-media-query"
import { Link } from "gatsby"

export const BreadcrumbsWrapper = styled.nav`
  width: 100%;
  margin: 0 0 0.75rem 0;
  padding: 0;

  ${media.lessThan("large")`
    padding: 0;
  `}
`

export const BreadcrumbsList = styled.ol`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  list-style: none;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: var(--muted);
  padding: 0;
  margin: 0;
`

export const BreadcrumbsItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const BreadcrumbsLink = styled(Link)`
  color: var(--muted);
  text-decoration: none;
  transition: color 0.2s;
  border-bottom: none;

  &:hover {
    color: var(--highlight);
  }
`

export const BreadcrumbsSeparator = styled.span`
  color: var(--borders);
  user-select: none;
`

export const BreadcrumbsCurrent = styled.span`
  color: var(--muted);
  font-weight: 400;
`
