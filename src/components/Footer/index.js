import React from "react"

import * as S from "./styled"

const Footer = () => (
  <S.FooterWrapper>
    <S.FooterContent>
      <S.FooterText>© 2026 Vitor Abreu</S.FooterText>
      <S.FooterLinks>
        <S.FooterLink
          href="https://github.com/vitorvaf"
          rel="noopener noreferrer"
        >
          GitHub
        </S.FooterLink>
        <S.FooterLink
          href="https://www.linkedin.com/in/vitor-abreu-freitas/"
          rel="noopener noreferrer"
        >
          LinkedIn
        </S.FooterLink>
      </S.FooterLinks>
    </S.FooterContent>
  </S.FooterWrapper>
)

export default Footer
