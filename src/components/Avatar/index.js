import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { getImage } from "gatsby-plugin-image"

import * as S from "./styled"

const Avatar = () => {
  const { avatarImage } = useStaticQuery(
    graphql`
      query {
        avatarImage: file(relativePath: { eq: "profile-photo.jpg" }) {
          childImageSharp {
            gatsbyImageData(width: 60, layout: CONSTRAINED)
          }
        }
      }
    `
  )

  const image = getImage(avatarImage)

  return <S.AvatarWrapper image={image} alt="Vitor Abreu" />
}

export default Avatar
