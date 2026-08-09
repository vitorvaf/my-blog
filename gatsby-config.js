require("dotenv").config()

module.exports = {
  siteMetadata: {
    title: `Vitor Abreu`,
    position: `Full Stack developer`,
    description: `Desenvolvedor full stack especializado em tecnologias Web
    e entusiasta de tecnologias mobile`,
    author: `@vitorvaf`,
    siteUrl: `https://vitorabreu.netlify.app/`,
  },
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-react-helmet`,
    // needs to be the first to work with gatsby-images
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `uploads`,
        path: `${__dirname}/static/assets/img`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/posts`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-relative-images",
            options: {
              // root of `media_folder` from static/admin/config.yml, matches
              // the `uploads` gatsby-source-filesystem instance above
              staticFolderName: "static",
            },
          },
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 960,
              linkImagesToOriginal: false,
            },
          },
          `gatsby-remark-lazy-load`,
          `gatsby-remark-prismjs`,
        ],
      },
    },

    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Vitor Abreu`,
        short_name: `Vitor Abreu`,
        start_url: `/`,
        background_color: `#232931`,
        theme_color: `#232931`,
        display: `minimal-ui`,
        icon: `src/images/blog-icon.svg`, // This path is relative to the root of the site.
      },
    },

    `gatsby-plugin-sitemap`,

    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    `gatsby-plugin-offline`,

    // CMS is now served as a static Sveltia CMS app from static/admin/index.html
    // (no Gatsby plugin required). See static/admin/config.yml for configuration.
  ],
}
