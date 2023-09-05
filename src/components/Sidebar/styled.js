import styled from 'styled-components'
import media from 'styled-media-query'

import AniLink from 'gatsby-plugin-transition-link/AniLink'

export const SidebarWrapper = styled.aside`
    align-items: flex-start;
    border-right: 1px solid var(--borders);
    background: var(--mediumBackground);
    display: flex;
    flex-direction: column;
    height: 10vh;
    position: fixed;
    padding:1rem 2rem;
    text-align: center;
    width: 100%;

    ${media.lessThan("large")`
        align-items: flex-start;
        height: auto;
        padding:1rem 2rem;
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

export const SidebarLink = styled(AniLink)`
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
    height: 3.75rem;
    padding: 1.1rem;
    position: relative;
    width: 3.75rem;

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
    height: 3.2rem;
    padding: .9rem;
    position: relative;
    width: 3.2rem;
  `}
`