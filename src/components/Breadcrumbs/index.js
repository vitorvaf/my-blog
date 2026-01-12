import React from "react"
import PropTypes from "prop-types"
import * as S from "./styled"

const Breadcrumbs = ({ items }) => (
  <S.BreadcrumbsWrapper aria-label="Navegação estrutural">
    <S.BreadcrumbsList>
      {items.map((item, index) => (
        <S.BreadcrumbsItem key={index}>
          {item.url ? (
            <>
              <S.BreadcrumbsLink to={item.url}>{item.label}</S.BreadcrumbsLink>
              {index < items.length - 1 && <S.BreadcrumbsSeparator>/</S.BreadcrumbsSeparator>}
            </>
          ) : (
            <S.BreadcrumbsCurrent aria-current="page">{item.label}</S.BreadcrumbsCurrent>
          )}
        </S.BreadcrumbsItem>
      ))}
    </S.BreadcrumbsList>
  </S.BreadcrumbsWrapper>
)

Breadcrumbs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      url: PropTypes.string,
    })
  ).isRequired,
}

export default Breadcrumbs
