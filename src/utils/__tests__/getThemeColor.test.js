import getThemeColor from "../getThemeColor"

describe("getThemeColor", () => {
  const originalTheme = window.__theme

  afterEach(() => {
    window.__theme = originalTheme
  })

  it("returns white when theme is 'light'", () => {
    window.__theme = "light"
    expect(getThemeColor()).toBe("#fff")
  })

  it("returns the dark background color when theme is 'dark'", () => {
    window.__theme = "dark"
    expect(getThemeColor()).toBe("#232931")
  })

  it("falls back to white when theme is unset or unknown", () => {
    window.__theme = undefined
    expect(getThemeColor()).toBe("#fff")

    window.__theme = "sepia"
    expect(getThemeColor()).toBe("#fff")
  })
})
