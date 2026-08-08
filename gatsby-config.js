require("dotenv").config()

const queries = require('./src/utils/algollia_queries')

// Warn (don't crash) when Algolia build-time credentials are missing. Without
// these, `gatsby-plugin-algolia-search` silently receives `undefined` values
// and either no-ops or errors deep inside the plugin — this surfaces the root
// cause up front. See `.env.example` and the README for setup instructions.
const requiredAlgoliaEnvVars = [
  'GATSBY_ALGOLIA_APP_ID',
  'ALGOLIA_ADMIN_KEY',
  'GATSBY_ALGOLIA_INDEX_NAME',
]
const missingAlgoliaEnvVars = requiredAlgoliaEnvVars.filter(
  (name) => !process.env[name]
)
if (missingAlgoliaEnvVars.length > 0) {
  console.warn(
    `[gatsby-config] Missing Algolia environment variable(s): ${missingAlgoliaEnvVars.join(
      ', '
    )}. Copy .env.example to .env and fill in values from https://www.algolia.com/account/api-keys/ — see README.md for details.`
  )
}


module.exports = {
  siteMetadata: {
    title: `Vitor Abreu`,
    position: `Full Stack developer`,
    description: `Desenvolvedor full stack especializado em tecnologias Web 
    e entusiasta de tecnologias mobile`,
    author: `@vitorvaf`,
    siteUrl:`https://vitorabreu.netlify.app/`
  },
  plugins: [
    `gatsby-plugin-transition-link`,
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
              name: "uploads",
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
      resolve: `gatsby-plugin-algolia-search`,
      options: {
        appId: process.env.GATSBY_ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_ADMIN_KEY,
        indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME, // for all queries
        queries,
        chunkSize: 10000, 
        enablePartialUpdates: true, // default: false        
      },
    },
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
     `gatsby-plugin-netlify-cms`
  ],
}
