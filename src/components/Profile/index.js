import React from "react"
import { useStaticQuery, graphql } from "gatsby"

import Logo from "../Logo"
import * as S from "./styled"


const Profile = () => {
  const {
    site: {
      siteMetadata: { description },
    },
  } = useStaticQuery(graphql`
    query MySiteMetaData {
      site {
        siteMetadata {
          title
          description
          position
        }
      }
    }
  `)

  return (
    <S.ProfileWrapper>
      <S.ProfileLink to="/">
        <S.ProfileLogo>
          <Logo />
        </S.ProfileLogo>
      </S.ProfileLink>
      <S.ProfileDescription>{description}</S.ProfileDescription>
    </S.ProfileWrapper>
  )
}

export default Profile

