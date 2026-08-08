import React from "react"
import renderer from "react-test-renderer"

import Breadcrumbs from "../index"

describe("Breadcrumbs", () => {
  it("renders each item and marks the last one as the current page", () => {
    const items = [
      { label: "Home", url: "/" },
      { label: "Posts", url: "/posts" },
      { label: "Um post" },
    ]

    const tree = renderer.create(<Breadcrumbs items={items} />).toJSON()
    const json = JSON.stringify(tree)

    // All three labels are rendered.
    expect(json).toContain("Home")
    expect(json).toContain("Posts")
    expect(json).toContain("Um post")

    // The final item (without a url) is marked as the current page.
    expect(json).toContain('"aria-current":"page"')

    // The nav has the expected accessible label.
    expect(json).toContain('"aria-label":"Navegação estrutural"')
  })

  it("renders separators between linked items but not after the current page", () => {
    const items = [
      { label: "Home", url: "/" },
      { label: "Sobre" },
    ]

    const tree = renderer.create(<Breadcrumbs items={items} />).toJSON()

    // Walk the render tree and count text nodes that are exactly "/".
    const countSeparators = node => {
      if (node == null) return 0
      if (typeof node === "string") return node === "/" ? 1 : 0
      if (Array.isArray(node)) return node.reduce((n, c) => n + countSeparators(c), 0)
      return countSeparators(node.children)
    }

    // Two items where the last is current → exactly one separator.
    expect(countSeparators(tree)).toBe(1)
  })
})
