let pagefind
let loadPromise

export const loadPagefind = async () => {
  if (pagefind) return pagefind
  if (typeof window === "undefined") return null

  if (!loadPromise) {
    loadPromise = import(/* webpackIgnore: true */ "/pagefind/pagefind.js")
      .then(async module => {
        const loadedPagefind = module.default || module

        if (typeof loadedPagefind.init === "function") {
          await loadedPagefind.init()
        }

        pagefind = loadedPagefind
        return pagefind
      })
      .catch(() => {
        loadPromise = null
        return null
      })
  }

  return loadPromise
}

const plainText = value =>
  String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim()

export const runSearch = async query => {
  const normalizedQuery = String(query || "").trim()
  const loadedPagefind = await loadPagefind()
  if (!loadedPagefind || typeof loadedPagefind.search !== "function") return []
  if (!normalizedQuery) return []

  try {
    const search = await loadedPagefind.search(normalizedQuery)
    const results = await Promise.all(
      search.results.slice(0, 8).map(async result => {
        const data = await result.data()
        const title = data.meta && data.meta.title

        if (!title) return null

        return {
          url: result.url || data.url,
          title,
          description: data.meta && data.meta.description,
          excerpt: plainText(
            data.excerpt || (data.meta && data.meta.description)
          ),
        }
      })
    )

    return results.filter(result => result && result.url)
  } catch (error) {
    return []
  }
}
