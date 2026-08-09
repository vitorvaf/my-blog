/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

function SEO({ description, lang, meta, title, image, date, location }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            siteUrl
          }
        }
      }
    `
  )

  const pageTitle = title || site.siteMetadata.title || ""
  const metaDescription = description || site.siteMetadata.description || ""

  const siteUrl = (site.siteMetadata.siteUrl || "").replace(/\/$/, "")
  const pathname = location && location.pathname ? location.pathname : "/"
  const url = `${siteUrl}${pathname}`
  const imagePath = (image || "/assets/img/cover.png").replace(/^\//, "")
  const ogImage = `${siteUrl}/${imagePath}`
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: pageTitle,
    description: metaDescription,
    author: {
      "@type": "Person",
      name: "Vitor Abreu",
    },
    image: ogImage,
    publisher: {
      "@type": "Person",
      name: "Vitor Abreu",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  }

  if (date) {
    articleSchema.datePublished = date
  }

  const structuredData = [
    articleSchema,
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${siteUrl}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: pageTitle,
          item: url,
        },
      ],
    },
  ]

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={pageTitle}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: pageTitle,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:image`,
          content: ogImage,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary_large_image`,
        },
        {
          name: `twitter:image:src`,
          content: ogImage,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.author,
        },
        {
          name: `twitter:title`,
          content: pageTitle,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ].concat(meta)}
      script={[
        {
          type: `application/ld+json`,
          innerHTML: JSON.stringify(structuredData),
        },
      ]}
    >
      <link rel="canonical" href={url} />
    </Helmet>
  )
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
}

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
  image: PropTypes.string,
  date: PropTypes.string,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
}

export default SEO
