import styled from "styled-components"
import media from "styled-media-query"
import { Link } from "gatsby"

export const BackButtonWrapper = styled.div`
  margin: 0;
  max-width: 70rem;
  padding: 1rem 5rem;
  position: relative;
  text-align: left;
  
  ${media.lessThan("large")`
    padding: 0 1rem;
    max-width: 100%;
  `}
`

export const BackButtonLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
  justify-content: flex-start;
  min-height: auto;
  min-width: auto;
  text-transform: uppercase;
  padding: 0.5rem 0.8rem;

  ${media.lessThan("large")`
    border-radius: 0;
    font-size: 0.9rem;
    padding: .2rem .5rem;
    margin-bottom: .7rem;
  `}

  body#grid & {
    margin-bottom: 1.5rem;
  }
`

export const PostItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1.5rem;

  ${media.lessThan("large")`
    margin: 0;
  `}
`

export const PostItemDate = styled.time`
  font-size: 0.9rem;
`

export const PostItemTitle = styled.h1`
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0.2rem 0 0.5rem;

  body#grid & {
    line-height: 1.1;
    margin: 0.8rem 0;
  }
`

export const PostItemDescription = styled.p`
  font-size: 1.2rem;
  font-weight: 300;
  line-height: 1.2;
`