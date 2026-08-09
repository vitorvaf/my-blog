import React from "react"
import PropTypes from "prop-types"

import * as S from "./styled"

const PostItem = ({ slug, category, date, timeToRead, title, description }) => (
  <S.PostItemLink to={slug}>
    <S.PostItemTitle>{title}</S.PostItemTitle>
    <S.PostItemMeta>
      {category} · {timeToRead} min · {date}
    </S.PostItemMeta>
    <S.PostItemDescription>{description}</S.PostItemDescription>
  </S.PostItemLink>
)

PostItem.propTypes = {
  slug: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  timeToRead: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
}

export default PostItem
