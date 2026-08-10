import styled from "styled-components"
import media from "styled-media-query"

// Single reading column — controls the shared width and horizontal padding
// for every article element (breadcrumb, header, body, code, related).
export const Column = styled.div`
  max-width: 680px;
  margin: 0 auto;
  padding: 0 32px;

  ${media.lessThan("large")`
    padding: 0 20px;
  `}
`

export const PostHeader = styled.header`
  color: var(--postColor);
  width: 100%;
  margin: 0;
  padding: 0;
`

export const PostTitle = styled.h1`
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin: 1rem 0 0 0;
  line-height: 1.15;

  @media (max-width: 1024px) {
    font-size: 1.9rem;
    line-height: 1.15;
  }
`

export const PostDescription = styled.p`
  font-family: var(--font-body);
  font-size: 1.25rem;
  font-weight: 400;
  color: var(--texts);
  line-height: 1.5;
  margin-top: 0.5rem;

  @media (max-width: 1024px) {
    font-size: 1.1rem;
    line-height: 1.5;
  }
`

export const PostDate = styled.p`
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--muted);
  margin: 0 0 0.5rem 0;
  letter-spacing: 0.02em;
`

export const MainContent = styled.section`
  width: 100%;
  margin: 0;
  padding: 0;
  font-size: 1.125rem;
  line-height: 1.75;
  color: var(--texts);

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

    ${media.lessThan("large")`
      word-break: break-word;
    `}
  }

  p {
    margin: 0 0 1.6rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5 {
    margin: 2.4rem 0 1rem;
  }

  ul,
  ol {
    list-style: disc;
    padding-left: 2.5rem;
    margin: 0 0 1.6rem;
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
    width: 100%;
    margin: 1.5rem 0;
  }

  blockquote {
    color: var(--texts);
    border-left: 3px solid var(--highlight);
    padding-left: 1rem;
    margin: 1.5rem 0;
  }

  hr {
    border: 1px solid var(--borders);
    margin: 3rem 0;
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

    ${media.lessThan("large")`
      font-size: 1.6rem;
    `}
  }

  h3 {
    font-size: 1.3rem;

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

  .gatsby-highlight,
  pre[class*="language-"] {
    background: var(--code-bg);
    border: 1px solid var(--borders);
    border-radius: 8px;
    overflow-x: auto;
  }

  pre[class*="language-"] {
    margin: 0;
    padding: 1rem 1.25rem;
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

  .post-content table {
    width: 100%;
    margin: 0 0 1.6rem;
    border-collapse: separate;
    border-spacing: 0;
    border: 1px solid var(--borders);
    border-radius: 8px;
    font-size: 0.9375rem;
    line-height: 1.5;
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;

    ${media.greaterThan("medium")`
      display: table;
      table-layout: auto;
    `}
  }

  .post-content thead {
    background: var(--postColor);
  }

  .post-content th {
    text-align: left;
    font-weight: 600;
    padding: 0.75rem 1rem;
    border-bottom: 2px solid var(--borders);
    color: var(--background);
    white-space: nowrap;
    letter-spacing: 0.01em;
  }

  .post-content td {
    text-align: left;
    vertical-align: top;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--borders);
    color: var(--texts);
  }

  .post-content tbody tr:last-child td {
    border-bottom: none;
  }

  .post-content tbody tr:nth-child(even) td {
    background: color-mix(in srgb, var(--texts) 4%, transparent);
  }

  .post-content table a {
    color: var(--highlight);
  }
`
