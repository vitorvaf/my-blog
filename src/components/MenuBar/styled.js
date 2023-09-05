import styled from 'styled-components'
import media from "styled-media-query"

import AniLink from 'gatsby-plugin-transition-link/AniLink'


export const MenuBarWrapper = styled.aside`
    border-top: 1px solid var(--borders);
    bottom: 0;    
    height: auto;
    padding: 0;
    position: fixed;
    width: 100%;
    display: flex;
    align-items: center;
    background: var(--mediumBackground);
    border-left: 1px solid var(--borders);
    border-top: 1px solid var(--borders);
    display: flex;
    flex-direction: row;    
    justify-content: space-between;        
    right: 0;    
    transition: background 0.5s;
    
  ${media.lessThan("large")`
    border-top: 1px solid var(--borders);
    bottom: 0;
    flex-direction: row;
    height: auto;
    padding: 0;
    position: fixed;
    width: 100%;
    display: flex;
  `}

`

export const MenuBarGroup = styled.div`
    display: flex;
    flex-direction: row;    

    ${media.lessThan("large")`
    flex-direction: row;
  `}
`

export const MenuBarLink = styled(AniLink)`
    display: block;

    &.active {
    span {
      color: var(--highlight);
    }
  }
`

export const MenuBarItem = styled.span`
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