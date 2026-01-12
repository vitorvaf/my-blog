import styled from 'styled-components'
import media from "styled-media-query"

import { Link } from 'gatsby'


export const MenuBarWrapper = styled.aside`
    align-items: center;
    background: var(--mediumBackground);
    border-left: 1px solid var(--borders);
    border-radius: 8px 0 0 8px;
    display: flex;
    flex-direction: column;
    height: auto;
    justify-content: center;
    padding: 0.5rem 0;
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    transition: background 0.5s;
    width: auto;
    z-index: 100;
    
  ${media.lessThan("large")`
    border-left: none;
    border-top: 1px solid var(--borders);
    border-radius: 0;
    bottom: 0;
    flex-direction: row;
    height: auto;
    padding: 0;
    top: auto;
    transform: none;
    width: 100%;
  `}

`

export const MenuBarGroup = styled.div`
    display: flex;
    flex-direction: column;    

    ${media.lessThan("large")`
    flex-direction: row;
  `}
`

export const MenuBarLink = styled(Link)`
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
    background: none;
    border: none;
    transition: color 0.3s;

    &:focus-visible {
        outline: 2px solid var(--highlight);
        outline-offset: 2px;
    }

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
      display: block;
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