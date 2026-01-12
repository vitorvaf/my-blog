import React from "react"
import propTypes from "prop-types"
import { Link } from 'gatsby'
import * as S from "./styled"


const Pagination = ({
  isFirst,
  isLast,
  currentPage,
  numPages,
  prevPage,
  nextPage,
}) => (
  <S.PaginationWrapper>
    {!isFirst && (
      <Link to={prevPage} aria-label="Ir para página anterior">
        ← página anterior
      </Link>
    )}
    <S.PaginationInfo>
      <S.PageIndicator>
        Página <strong>{currentPage}</strong> de <strong>{numPages}</strong>
      </S.PageIndicator>
      <S.ProgressBar>
        <S.ProgressFill width={(currentPage / numPages) * 100} />
      </S.ProgressBar>
    </S.PaginationInfo>
    {!isLast && (
      <Link to={nextPage} aria-label="Ir para próxima página">
        próxima página →
      </Link>
    )}
  </S.PaginationWrapper>
)

Pagination.propTypes = {
  isFirst: propTypes.bool.isRequired,
  isLast: propTypes.bool.isRequired,
  currentPage: propTypes.number.isRequired,
  numPages: propTypes.number.isRequired,
  prevPage: propTypes.string,
  nextPage: propTypes.string,
}

export default Pagination
