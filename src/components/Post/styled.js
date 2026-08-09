import styled from "styled-components"
import media from "styled-media-query"

export const PostHeader = styled.header`
  color: var(--postColor);
  margin: auto;
  max-width: 70rem;
  padding: 0;

  ${media.lessThan("large")`
    padding: 0;
    max-width: 100%;
  `}
`

export const PostTitle = styled.h1`
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  padding: 0 5rem;
  margin: 1rem auto;
  line-height: 1.15;

  @media (max-width: 1024px) {
    font-size: 1.9rem;
    line-height: 1.15;
    padding: 0 1rem;
  }
`

export const PostDescription = styled.p`
  font-family: var(--font-body);
  font-size: 1.25rem;
  font-weight: 400;
  padding: 0 5rem;
  color: var(--texts);
  line-height: 1.5;
  margin-top: 0.5rem;

  @media (max-width: 1024px) {
    font-size: 1.1rem;
    line-height: 1.5;
    padding: 0 1rem;
  }
`

export const PostDate = styled.p`
  font-size: 1.1rem;
  font-weight: 100;
  padding: 0 5rem;
  margin-top: 1rem;

  ${media.lessThan("large")`
    padding: 0 1rem;
  `}
`

export const MainContent = styled.section`
  max-width: 680px;
  margin: 0 auto;
  padding: 2rem 5rem;
  font-size: 1.125rem;
  line-height: 1.75;
  color: var(--texts);

  ${media.lessThan("large")`
    padding: 2rem 0;
    max-width: 100%;
  `}

  p,
  h1,
  h2,
  h3,
  h4,
  ul,
  ol,
  .tags,
  iframe,
  .button-post {
    color: var(--texts);
    font-size: 1.125rem;
    font-weight: 400;
    line-height: 1.7;
    letter-spacing: 0.01rem;
    padding: 0 1.4rem;

    ${media.lessThan("large")`
      padding: 0 1rem;
      word-break: break-word;
    `}
  }

  p {
    margin: 0 auto 1.6rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5 {
    margin: 2.4rem auto 1rem;
  }

  ul,
  ol {
    list-style: disc;
    padding-left: 2.5rem;
    margin: 0 auto 1.6rem;
  }

  li {
    padding: 0.625rem 0;

    & > ul {
      margin-bottom: 0;
    }
  }

  p,
  li {
    code {
      word-wrap: break-word;
    }
  }

  img {
    display: block;
    max-width: 100%;
  }

  iframe {
    padding: 0 1.6rem 1.6rem;
    width: 100%;

    ${media.lessThan("large")`
      padding: 0 1rem;
    `}
  }

  blockquote {
    color: var(--texts);
    border-left: 3px solid var(--highlight);
    padding-left: 1rem;
    margin: 1.5rem 0;
  }

  hr {
    border: 1px solid var(--borders);
    margin: 3rem auto;
  }

  #twitter-widget-0,
  .instagram-media,
  .twitter-tweet {
    margin: 20px auto !important;
  }

  h1,
  h2,
  h3,
  h4,
  h5 {
    font-family: var(--font-display);
    font-weight: 600;
    letter-spacing: 0.01rem;
    line-height: 1.3;
    color: var(--postColor);
  }

  h1 {
    font-size: 2.25rem;

    ${media.lessThan("large")`
      font-size: 1.75rem;
    `}
  }

  h2 {
    font-size: 1.6rem;
    margin-top: 2rem;

    ${media.lessThan("large")`
      font-size: 1.6rem;
    `}
  }

  h3 {
    font-size: 1.3rem;
    margin-top: 2rem;

    ${media.lessThan("large")`
      font-size: 1.3rem;
    `}
  }

  h4 {
    font-size: 1.25rem;
  }

  h5 {
    font-size: 1.1rem;
  }

  strong {
    font-weight: 700;
  }

  .gatsby-resp-image-background-image {
    z-index: 2;
    opacity: 1 !important;
  }

  .gatsby-resp-image-image {
    box-shadow: none !important;
    transition: opacity 0.2s;

    &.lazyload {
      opacity: 0;
    }

    &.lazyloaded {
      opacity: 1;
      z-index: 3;
    }
  }

  .gatsby-highlight {
    padding: 0 1.6rem 1.6rem;

    ${media.lessThan("large")`
      padding: 0;
    `}
  }

  .gatsby-highlight,
  pre[class*="language-"] {
    background: var(--code-bg);
    border: 1px solid var(--borders);
    border-radius: 8px;
    overflow-x: auto;
  }

  .instagram-media {
    margin: 1rem auto !important;
  }

  a {
    color: var(--highlight);
    text-decoration: underline;
    text-underline-offset: 2px;
    transition: opacity 0.2s;

    svg {
      color: var(--postColor);
    }

    &:hover {
      opacity: 0.8;
    }
  }
`
