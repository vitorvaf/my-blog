import React, { Suspense, lazy } from "react"
import { graphql } from "gatsby"

import Layout from "../components/Layout"
import SEO from "../components/seo"
import * as S from "../components/Post/styled"
import RecommendedPosts from "../components/RecommendedPosts"
import BackButton from "../components/BackButton"
import Breadcrumbs from "../components/Breadcrumbs"
import ReadingProgress from "../components/ReadingProgress"
import CodeCopyButton from "../components/CodeCopyButton"
import TableOfContents from "../components/TableOfContents"
import LoadingSkeleton from "../components/LoadingSkeleton"

const Comments = lazy(() => import("../components/Comments"))

const BlogPost = ({ data, pageContext }) => {
  const post = data.markdownRemark
  const next = pageContext.nextPost
  const previous = pageContext.previousPost

  const breadcrumbItems = [
    { label: "Home", url: "/" },
    { label: "Blog", url: "/" },
    { label: post.frontmatter.title },
  ]

  return (
    <Layout>
      <ReadingProgress />
      <CodeCopyButton />
      <SEO
        title={post.frontmatter.title}
        PostDescription={post.frontmatter.description}
        image={post.frontmatter.image}
      ></SEO>
      <BackButton />
      <S.PostHeader>
        <Breadcrumbs items={breadcrumbItems} />
        <S.PostDate>
          {post.frontmatter.date} • {post.timeToRead} min de leitura
        </S.PostDate>
        <S.PostTitle>{post.frontmatter.title}</S.PostTitle>
        <S.PostDescription>{post.frontmatter.description}</S.PostDescription>
      </S.PostHeader>
      <S.MainContent>
        <TableOfContents />
        <div className="post-content" dangerouslySetInnerHTML={{ __html: post.html }}></div>
      </S.MainContent>
      <RecommendedPosts next={next} previous={previous} />
      <Suspense fallback={<LoadingSkeleton />}>
        <Comments url={post.fields.slug} title={post.frontmatter.title} />
      </Suspense>
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
