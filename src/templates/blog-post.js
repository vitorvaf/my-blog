import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/Layout"
import SEO from "../components/seo"
import * as S from "../components/Post/styled"
import RecommendedPosts from "../components/RecommendedPosts"
import Breadcrumbs from "../components/Breadcrumbs"
import CodeCopyButton from "../components/CodeCopyButton"
import TableOfContents from "../components/TableOfContents"

const BlogPost = ({ data, pageContext, location }) => {
  const post = data.markdownRemark
  const next = pageContext.nextPost
  const previous = pageContext.previousPost

  const breadcrumbItems = [
    { label: "Home", url: "/" },
    { label: post.frontmatter.title },
  ]

  return (
    <Layout>
      <CodeCopyButton />
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description}
        image={post.frontmatter.image}
        date={post.frontmatter.date}
        location={location}
      ></SEO>
      <article data-pagefind-body>
        <S.LayoutGrid>
          <S.TOCSidebar>
            <TableOfContents variant="desktop" />
          </S.TOCSidebar>
          <S.ArticleColumn>
            <S.PostHeader>
              <Breadcrumbs items={breadcrumbItems} />
              <S.PostDate>
                {post.frontmatter.date} • {post.timeToRead} min de leitura
              </S.PostDate>
              <S.PostTitle>{post.frontmatter.title}</S.PostTitle>
              <S.PostDescription>
                {post.frontmatter.description}
              </S.PostDescription>
            </S.PostHeader>
            <S.MainContent>
              <TableOfContents variant="mobile" />
              <div
                className="post-content"
                dangerouslySetInnerHTML={{ __html: post.html }}
              ></div>
            </S.MainContent>
            <RecommendedPosts next={next} previous={previous} />
          </S.ArticleColumn>
        </S.LayoutGrid>
      </article>
    </Layout>
  )
}

export const query = graphql`
  query Post($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      fields {
        slug
      }
      frontmatter {
        title
        description
        date(locale: "pt-br", formatString: "DD [de] MMMM [de] YYYY")
        image
      }
      html
      timeToRead
    }
  }
`

export default BlogPost
