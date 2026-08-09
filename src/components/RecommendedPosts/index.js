import React from "react"
import propTypes from "prop-types"
import * as S from "./styled"

const getPostMeta = post => {
  const category = post.category || post.frontmatter.category
  const timeToRead = post.timeToRead || post.frontmatter.timeToRead

  return `${category} · ${timeToRead} min`
}

const RecommendedPosts = ({ next, previous }) => (
  <S.RecommendedWrapper>
    <S.RecommendedHeading>Related writing</S.RecommendedHeading>
    {previous && (
      <S.RecommendedLink to={previous.fields.slug}>
        <S.RecommendedTitle>{previous.frontmatter.title}</S.RecommendedTitle>
        <S.RecommendedMeta>{getPostMeta(previous)}</S.RecommendedMeta>
      </S.RecommendedLink>
    )}
    {next && (
      <S.RecommendedLink to={next.fields.slug}>
        <S.RecommendedTitle>{next.frontmatter.title}</S.RecommendedTitle>
        <S.RecommendedMeta>{getPostMeta(next)}</S.RecommendedMeta>
      </S.RecommendedLink>
    )}
  </S.RecommendedWrapper>
)

RecommendedPosts.propTypes = {
  next: propTypes.shape({
    frontmatter: propTypes.shape({
      title: propTypes.string.isRequired,
      category: propTypes.string,
      timeToRead: propTypes.oneOfType([propTypes.string, propTypes.number]),
    }),
    category: propTypes.string,
    timeToRead: propTypes.oneOfType([propTypes.string, propTypes.number]),
    fields: propTypes.shape({
      slug: propTypes.string.isRequired,
    }),
  }),
  previous: propTypes.shape({
    frontmatter: propTypes.shape({
      title: propTypes.string.isRequired,
      category: propTypes.string,
      timeToRead: propTypes.oneOfType([propTypes.string, propTypes.number]),
    }),
    category: propTypes.string,
    timeToRead: propTypes.oneOfType([propTypes.string, propTypes.number]),
    fields: propTypes.shape({
      slug: propTypes.string.isRequired,
    }),
  }),
}

export default RecommendedPosts
