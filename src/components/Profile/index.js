import React from "react"
import { useStaticQuery, graphql } from "gatsby"

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
          <svg width="50" height="50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="20" width="80" height="60" rx="8" ry="8" fill="var(--logo-rect-fill)" opacity="var(--logo-rect-opacity)"/>
            <text x="30" y="55" fontFamily="monospace" fontSize="24" fill="#ffffff">&lt;/&gt;</text>
          </svg>
        </S.ProfileLogo>
      </S.ProfileLink>
      <S.ProfileDescription>{description}</S.ProfileDescription>
    </S.ProfileWrapper>
  )
}

export default Profile

