import React from "react"
import * as S from "./styled"

const LoadingSkeleton = ({ type = "post" }) => {
  if (type === "post") {
    return (
      <S.SkeletonWrapper>
        <S.SkeletonTitle />
        <S.SkeletonText width="80%" />
        <S.SkeletonText width="90%" />
        <S.SkeletonText width="70%" />
      </S.SkeletonWrapper>
    )
  }

  return null
}

export default LoadingSkeleton
