import React from "react"

import * as S from "./styled"

const Footer = () => (
  <S.FooterWrapper>
    <S.FooterContent>
      <S.FooterText>
        © {new Date().getFullYear()} - Blog pessoal sobre desenvolvimento, tecnologia e programação.
      </S.FooterText>
      <S.FooterText>
        Todos os direitos reservados
      </S.FooterText>
    </S.FooterContent>
  </S.FooterWrapper>
)

export default Footer
