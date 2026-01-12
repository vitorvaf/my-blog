import styled from 'styled-components'
import media from "styled-media-query"


export const PaginationWrapper = styled.section`
    align-items: center;
    border-top: 1px solid var(--borders);
    color: var(--texts);
    display: flex;
    padding: 1.5rem 3rem;
    justify-content: space-between;
    gap: 1rem;

    ${media.lessThan("large")`
    font-size: .8rem;
    padding: 1rem;
  `}

    a{
        color: var(--texts);
        text-decoration: none;
        transition: color 0.5s;
        white-space: nowrap;

        &:hover{
            color: var(--highlight);
        }
    }
`

export const PaginationInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
`

export const PageIndicator = styled.p`
    margin: 0;
    font-size: 0.95rem;
    
    strong {
        color: var(--highlight);
    }
`

export const ProgressBar = styled.div`
    width: 100%;
    max-width: 200px;
    height: 4px;
    background: var(--borders);
    border-radius: 2px;
    overflow: hidden;
`

export const ProgressFill = styled.div`
    height: 100%;
    width: ${props => props.width}%;
    background: var(--highlight);
    transition: width 0.3s ease;
`