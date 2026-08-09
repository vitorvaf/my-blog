import { createGlobalStyle } from "styled-components"

const GlobalStyles = createGlobalStyle`
    /* http://meyerweb.com/eric/tools/css/reset/ 
   v2.0 | 20110126
   License: none (public domain)
*/

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}
* {
    box-sizing: border-box;
}
body {
    background: var(--background);
    line-height: 1.6;
    font-size: 100%;
    font-family: var(--font-body);
    color: var(--texts);
    transition: background-color .2s ease, color .2s ease;
}

@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition: none !important;
        scroll-behavior: auto !important;
    }
}

img {
    display: block;
    width: 100%;
    height: auto;    
    border-radius: 4px;
}

a {
    color: var(--highlight);
    text-decoration: underline;
    text-underline-offset: 2px;
}

a:hover {
    opacity: 0.8;
}

p {
    line-height: 1.7;
    margin-bottom: 1.5rem;
}

h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-display);
    font-weight: 600;
    line-height: 1.3;
    margin: 2rem 0 1rem;
    color: var(--postColor);
}

*:focus-visible {
    outline: 2px solid var(--highlight);
    outline-offset: 2px;
}

code:not(pre code) {
    font-family: var(--font-mono);
    font-size: .9em;
    background: var(--code-bg);
    padding: .15em .4em;
    border-radius: 4px;
}

body.dark {
    --borders: #262626;
    --texts: #A6A6A6;
    --postColor: #EDEDED;
    --highlight: #4DBCB3;
    --mediumBackground: #1A1A1A;
    --background: #111111;
    --white: #ffffff;
    --black: #111111;
    --code-bg: #1F1F1F;
    --muted: #6B6B6B;
    --font-display: 'Newsreader', Georgia, 'Times New Roman', serif;
    --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-mono: 'JetBrains Mono', 'SFMono-Regular', Consolas, monospace;
} 

body.light {
    --borders: #ECECEC;
    --texts: #5A5A5A;
    --postColor: #161616;
    --highlight: #2E8F88;
    --mediumBackground: #FFFFFF;
    --background: #FBFBF9;
    --white: #ffffff;
    --black: #161616;
    --code-bg: #F4F4F1;
    --muted: #9A9A9A;
    --font-display: 'Newsreader', Georgia, serif;
    --font-body: 'Inter', -apple-system, sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
}

/* Copy Code Button Styles */
.copy-code-button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    padding: 0.4rem 0.8rem;
    font-size: 0.75rem;
    font-weight: 600;
    background: var(--highlight);
    color: var(--background);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    opacity: 0.9;
    z-index: 10;
}

.copy-code-button:hover {
    opacity: 1;
    transform: translateY(-1px);
}

.copy-code-button:active {
    transform: translateY(0);
}

.copy-code-button.copied {
    background: #4caf50;
}

.copy-code-button:focus-visible {
    outline: 2px solid var(--highlight);
    outline-offset: 2px;
}

`

export default GlobalStyles
