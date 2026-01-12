import styled from  'styled-components'
import media from 'styled-media-query'

import { Link } from 'gatsby'

export const MenuLinksWrapper = styled.nav`
    ${media.lessThan("large")`
        display: none;
    `}
`

export const MenuLinkList = styled.ul`
    font-size: 0.95rem;
    font-weight: 400;
    display: flex;
    gap: 1.5rem;
    align-items: center;
`
export const MenuLinksItem = styled.li`
    padding: 0;

    .active{
        color: var(--highlight);
    }
`

export const MenuLinksLink =  styled(Link)`
    color: var(--texts);
    text-decoration: none;
    transition: color 0.5s;


    &:hover{
        color: var(--highlight);
    }

`