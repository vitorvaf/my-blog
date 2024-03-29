const postQuery = `{
    posts: allMarkdownRemark(
        sort: { fields: frontmatter___date, order: DESC }
        
      ) {
        edges {
          node {
            objectID: id
            fields {
              slug
            }
            frontmatter {
              category
              date_timestamp: date
              date(locale: "pt-br", formatString: "DD [de] MMMM [de] YYYY")
              description
              title
              background
            }    
             excerpt(pruneLength: 5000)       
          }
        }
      }
}`


const flatten =  arr =>
    arr.map(({ node: { frontmatter,  ...rest}}) => ({
        ...frontmatter,
        date_timestamp: parseInt(
            (new Date(frontmatter.date_timestamp).getTime() / 1000).toFixed(0)
        ),
        ...rest
    }))

const queries = [
    {
      query: postQuery,
      transformer: ({ data }) => flatten(data.posts.edges),
      indexName: 'Posts', // overrides main index name, optional
      settings: {
        attributsToSnippet: ['excerpt:20']
      }      
    },
  ];

  module.exports = queries
  

