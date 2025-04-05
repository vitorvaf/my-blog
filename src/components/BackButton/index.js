import React from "react"
import * as S from "./styled"

const BackButton = () => {
  return (
    <S.BackButtonWrapper>
      <S.BackButtonLink to="/" cover direction="left" bg="var(--background)" duration={0.6}>
        <svg 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M19 12H5" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M12 19L5 12L12 5" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
        Voltar para a listagem
      </S.BackButtonLink>
    </S.BackButtonWrapper>
  )
}

export default BackButton