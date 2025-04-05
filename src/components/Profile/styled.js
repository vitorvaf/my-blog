import styled from 'styled-components'
import media from 'styled-media-query'
import { Link } from 'gatsby'


export const ProfileWrapper = styled.section`
    color: var(--texts);
    display: flex;
    flex-direction: column;
`

export const ProfileLink = styled(Link)`
    color: var(--texts);
    text-decoration: none;
    transition: color 0.5s;   
    display: flex;
    align-items: center;
    justify-content: center;

    ${media.lessThan("large")`
        display: flex;
        justify-content: flex-start;
    `}

    &:hover {
        color: var(--highlight);
    } 
`

export const ProfileLogo = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    
    svg {
        transition: transform 0.3s;
    }
    
    &:hover svg {
        transform: scale(1.1);
    }
    
    ${media.lessThan("large")`
        svg {
            width: 40px;
            height: 40px;
        }
    `}
`

export const ProfileAuthor = styled.h1`
    font-size: 1.6rem;
    margin: 0.5rem auto 1.5rem;

    ${media.lessThan("large")`
        font-size: 1.2rem;
        margin: 0 0 0 10px;  
    `}
`

export const ProfilePosition = styled.small`
    display: block;
    font-size: 0.9rem;
    font-weight: 300;
    margin-left: 0.5rem;    color: var(--texts);
    ${media.lessThan("large")`
        font-size: 0.8rem;
        margin-left: 0.5rem;  
    `}


`

export const ProfileDescription = styled.p`
    font-size: 1rem;
    font-weight: 300;
    line-height: 1.4;
    display: none;  

    ${media.lessThan("large")`
        display: none;  
    `}
`