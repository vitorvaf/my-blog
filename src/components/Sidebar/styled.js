import styled from 'styled-components'
import media from 'styled-media-query'

import { Link } from 'gatsby'

export const SidebarWrapper = styled.aside`
    align-items: flex-start;
    border-right: 1px solid var(--borders);
    background: var(--mediumBackground);
    display: flex;
    flex-direction: column;
    height: auto;
    position: fixed;
    padding: 0.75rem 1.5rem;.5rem;
    text-align: center;
    width: 100%;    box-shadow: 0 1px 2px rgba(0,0,0,0.05);    box-shadow: 0 1px 2px rgba(0,0,0,0.05);

    ${media.lessThan("large")`
        align-items: flex-start;
        padding: 0.75rem 1.5rem;
        padding: 0.75rem 1.5rem;
        width: 100%;

    `}
`

export const SidebarGroup = styled.div`
    display: flex;
    flex-direction: row;  
    justify-content: flex-end;

    ${media.lessThan("large")`
    flex-direction: row;
  `}
`

export const SidebarLink = styled(Link)`
    display: block;

    &.active {
    span {
      color: var(--highlight);
    }
  }
`

export const SidebarItem = styled.span`
    color: var(--texts);
    cursor: pointer;
    display: block;
    height: 3.25rem;
    padding: 1rem;
    position: relative;
    width: 3.25rem;
    transition: color 0.2s;

    &.light {
        color: #d4d400;

        &:hover {
            color: #e2e340
        }
    }

    &:hover {
        color: var(--highlight);
    }

    &.display {
    ${media.lessThan("large")`
      display: none;
    `}
  }
  ${media.greaterThan("large")`
    &:hover {
      color: var(--highlight);
    }
  `}
  ${media.lessThan("large")`
    height: 2.8rem;
    padding: 0.8rem;
    position: relative;
    width: 2.8rem;
  `}
`
