const path = require("path")

const { createFilePath } = require(`gatsby-source-filesystem`)

// You can delete this file if you're not using it
// To add the slug field to each post

// `frontmatter.image` holds site-relative paths like `/assets/img/cover.webp`.
// Because `static/assets/img` is also a gatsby-source-filesystem source (and
// gatsby-remark-relative-images rewrites the relative variants), inference
// would type the field as `File`, breaking every query/consumer that treats
// it as a plain string (PostList below, the post page query and SEO).
// Pinning it to String keeps the raw path value.
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  createTypes(`
    type MarkdownRemarkFrontmatter {
      image: String
    }
  `)
}

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  // Ensures we are processing only markdown files
  if (node.internal.type === "MarkdownRemark") {
    // Use `createFilePath` to turn markdown files in our `data/faqs` directory into `/faqs/slug`
    const slug = createFilePath({
      node,
      getNode,
      basePath: "pages",
    })

    // Creates new query'able field with name of 'slug'
    createNodeField({
      node,
      name: "slug",
      value: `/${slug.slice(12)}`,
    })
  }
}

// To create the posts pages
exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions
  const result = await graphql(`
    query PostList {
      allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              background
              category
              date(locale: "pt-br", formatString: "DD [de] MMMM [de] YYYY")
              description
              title
              image
            }
            timeToRead
          }
          next {
            frontmatter {
              title
            }
            fields {
              slug
            }
          }
          previous {
            fields {
              slug
            }
            frontmatter {
              title
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild(
      `Error loading markdown posts for page creation`,
      result.errors
    )
    return
  }

  const posts = result.data.allMarkdownRemark.edges

  posts.forEach(({ node }) => {
    const currentIndex = posts.findIndex(
      ({ node: candidate }) => candidate.fields.slug === node.fields.slug
    )
    const sameCategory = posts.filter(
      ({ node: candidate }) =>
        candidate.fields.slug !== node.fields.slug &&
        candidate.frontmatter.category === node.frontmatter.category
    )
    const relatedCandidates =
      sameCategory.length >= 2
        ? sameCategory
        : posts.filter(
            ({ node: candidate }) => candidate.fields.slug !== node.fields.slug
          )
    const relatedPosts = relatedCandidates
      .sort(
        ({ node: first }, { node: second }) =>
          Math.abs(
            posts.findIndex(({ node: candidate }) => candidate === first) -
              currentIndex
          ) -
          Math.abs(
            posts.findIndex(({ node: candidate }) => candidate === second) -
              currentIndex
          )
      )
      .slice(0, 2)
      .map(({ node: relatedNode }) => ({
        frontmatter: { title: relatedNode.frontmatter.title },
        fields: { slug: relatedNode.fields.slug },
      }))

    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/blog-post.js`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        slug: node.fields.slug,
        previousPost: relatedPosts[0],
        nextPost: relatedPosts[1],
      },
    })
  })

  const postPerPage = 6
  const numPages = Math.ceil(posts.length / postPerPage)

  Array.from({ length: numPages }).forEach((_, index) => {
    createPage({
      path: index === 0 ? `/` : `/page/${index + 1}`,
      component: path.resolve(`./src/templates/blog-list.js`),
      context: {
        limit: postPerPage,
        skip: index * postPerPage,
        numPages,
        currentPage: index + 1,
      },
    })
  })
}

// Serve the Sveltia CMS admin panel in `gatsby develop`.
// In production builds, `static/admin/index.html` is served automatically as a
// static asset, so this middleware only bridges the dev server. (The former
// `gatsby-plugin-netlify-cms` used to register the /admin route for dev.)
exports.onCreateDevServer = ({ app }) => {
  const express = require("express")
  app.use(
    "/admin",
    express.static(path.join(__dirname, "static", "admin"), {
      index: "index.html",
    })
  )
}
