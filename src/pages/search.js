import React, { useEffect, useState } from "react"
import styled from "styled-components"

import Layout from "../components/Layout"
import SEO from "../components/seo"
import { loadPagefind, runSearch } from "../utils/pagefind"

const SearchPageContent = styled.section`
  width: 100%;
  max-width: 760px;
  margin: 0 auto;

  h1 {
    margin: 0 0 1.5rem;
    color: var(--postColor);
    font-family: var(--font-display);
  }
`

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 0;
  color: var(--postColor);
  font: inherit;
  font-size: 1.25rem;
  background: transparent;
  border: 0;
  border-bottom: 1px solid var(--borders);
  outline: 0;

  &:focus {
    border-color: var(--highlight);
  }

  &::placeholder {
    color: var(--muted);
  }
`

const Results = styled.div`
  margin-top: 2rem;
`

const Result = styled.article`
  padding: 1rem 0;
  border-bottom: 1px solid var(--borders);
`

const ResultTitle = styled.a`
  color: var(--postColor);
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 600;
  text-decoration: none;

  &:hover,
  &:focus-visible {
    color: var(--highlight);
  }
`

const ResultMeta = styled.p`
  margin: 0.35rem 0 0;
  color: var(--muted);
  font-size: 0.8125rem;
  line-height: 1.5;
`

const Status = styled.p`
  color: var(--muted);
  font-size: 0.875rem;
`

const SearchPage = () => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagefindAvailable, setPagefindAvailable] = useState(null)

  useEffect(() => {
    let active = true

    loadPagefind().then(pagefind => {
      if (active) setPagefindAvailable(Boolean(pagefind))
    })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setLoading(false)
      return undefined
    }

    let active = true
    const timer = window.setTimeout(async () => {
      setLoading(true)
      const pagefind = await loadPagefind()

      if (!pagefind) {
        if (active) {
          setPagefindAvailable(false)
          setResults([])
          setLoading(false)
        }
        return
      }

      const nextResults = await runSearch(query)
      if (active) {
        setPagefindAvailable(true)
        setResults(nextResults)
        setLoading(false)
      }
    }, 150)

    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [query])

  return (
    <Layout>
      <SEO title="Buscar | Vitor Abreu" />
      <SearchPageContent>
        <h1>Buscar</h1>
        <SearchInput
          type="search"
          value={query}
          placeholder="Buscar artigos…"
          aria-label="Buscar artigos"
          onChange={event => setQuery(event.target.value)}
        />
        <Results>
          {loading && <Status>Buscando…</Status>}
          {!loading && pagefindAvailable === false && (
            <Status>A busca é indexada após o build.</Status>
          )}
          {!loading &&
            pagefindAvailable &&
            query.trim() &&
            results.length === 0 && <Status>Nenhum resultado.</Status>}
          {results.map(result => (
            <Result key={result.url}>
              <ResultTitle href={result.url}>{result.title}</ResultTitle>
              {(result.description || result.excerpt) && (
                <ResultMeta>{result.description || result.excerpt}</ResultMeta>
              )}
            </Result>
          ))}
        </Results>
      </SearchPageContent>
    </Layout>
  )
}

export default SearchPage
