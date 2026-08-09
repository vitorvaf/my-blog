import React from "react"
import { graphql } from "gatsby"
import styled from "styled-components"

import Layout from "../components/Layout"
import SEO from "../components/seo"
import PostItem from "../components/PostItem"
import Pagination from "../components/Pagination"

import * as S from "../components/ListWrapper/styled"

const EditorialColumn = styled.div`
  margin: 0 auto;
  max-width: 760px;
`

const Intro = styled.header`
  margin-bottom: 3rem;
`

const IntroTitle = styled.h1`
  color: var(--postColor);
  font-family: var(--font-display);
  font-size: 2.75rem;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin: 0;
`

const Role = styled.p`
  color: var(--texts);
  font-size: 1.125rem;
  font-weight: 500;
  margin: 0.75rem 0 0;
`

const Topics = styled.p`
  color: var(--muted);
  font-size: 0.9375rem;
  margin: 0.25rem 0 0;
`

const Tagline = styled.p`
  color: var(--texts);
  font-size: 1.0625rem;
  line-height: 1.5;
  margin: 1.5rem 0 0;
  max-width: 620px;
`

const SocialRow = styled.nav`
  display: flex;
  gap: 1rem;
  margin-top: 1.25rem;

  a {
    color: var(--highlight);
    text-decoration: underline;
  }
`

const WritingLabel = styled.h2`
  color: var(--muted);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  margin: 0 0 0.75rem;
`

const YearHeading = styled.h3`
  color: var(--muted);
  font-family: var(--font-display);
  font-size: 0.875rem;
  font-weight: 400;
  margin: 1.75rem 0 0;
`

const BlogList = props => {
  const postList = props.data.allMarkdownRemark.edges

  const postsByYear = postList.reduce((groups, edge) => {
    const year = edge.node.frontmatter.date.slice(-4)

    if (!groups[year]) {
      groups[year] = []
    }

    groups[year].push(edge)
    return groups
  }, {})

  const years = Object.keys(postsByYear).sort((a, b) => b - a)

  const { currentPage, numPages } = props.pageContext
  const isFirst = currentPage === 1
  const isLast = currentPage === numPages
  const prevPage = currentPage - 1 === 1 ? "/" : `/page/${currentPage - 1}`
  const nextPage = `/page/${currentPage + 1}`

  return (
    <Layout>
      <SEO title="Home" />
      <EditorialColumn>
        <Intro>
          <IntroTitle>Vitor Abreu</IntroTitle>
          <Role>Software Engineer</Role>
          <Topics>.NET · Distributed Systems · AI-assisted Engineering</Topics>
          <Tagline>
            Notas sobre arquitetura de software, sistemas distribuídos e
            engenharia com LLMs — da prática para a página.
          </Tagline>
          <SocialRow aria-label="Redes sociais">
            <a href="https://github.com/vitorvaf">GitHub</a>
            <a href="https://www.linkedin.com/in/vitor-abreu-freitas/">
              LinkedIn
            </a>
          </SocialRow>
        </Intro>

        <S.ListWrapper>
          <WritingLabel>WRITING</WritingLabel>
          {years.map(year => (
            <section key={year}>
              <YearHeading>{year}</YearHeading>
              {postsByYear[year].map(
                ({
                  node: {
                    frontmatter: { category, date, description, title },
                    timeToRead,
                    fields: { slug },
                  },
                }) => (
                  <PostItem
                    key={slug}
                    slug={slug}
                    category={category}
                    date={date}
                    timeToRead={timeToRead}
                    title={title}
                    description={description}
                  />
                )
              )}
            </section>
          ))}
        </S.ListWrapper>

        <Pagination
          isFirst={isFirst}
          isLast={isLast}
          currentPage={currentPage}
          numPages={numPages}
          prevPage={prevPage}
          nextPage={nextPage}
        />
      </EditorialColumn>
    </Layout>
  )
}

export const query = graphql`
  query PostList($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            background
            category
            date(locale: "pt-br", formatString: "DD [de] MMMM [de] YYYY")
            description
            title
          }
          timeToRead
        }
      }
    }
  }
`

export default BlogList
