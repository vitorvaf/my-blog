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
    line-height: 1.5;
    font-size: 100%;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    color: var(--texts);
    transition: background 0.3s, color 0.3s;
}

@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
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
    text-decoration: none;
    transition: opacity 0.2s;
}

a:hover {
    opacity: 0.8;
}

p {
    line-height: 1.7;
    margin-bottom: 1.5rem;
}

h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.3;
    margin: 2rem 0 1rem;
    color: var(--postColor);
}


body.dark {
    --borders: #2a2a2a;
    --texts: #e0e0e0;
    --postColor: #fff;
    --highlight: #4ecca3;
    --mediumBackground: #1a1a1a;
    --background: #121212;
    --white: #fff;
    --black: #121212;
    --logo-rect-fill: var(--highlight);
    --logo-rect-opacity: 0.9;
} 


/* body.dark {
    --borders: #38444d;
    --texts: #8899a6;
    --postColor: #fff;
    --highlight: #1fa1f2;
    --mediumBackground: #192734;
    --background: #16202c;
    --white: #fff;
    --black: #222;
}  */

body.light{
    --borders: #dedede;
    --postColor: #222;
    --texts: #4a4a4a;
    --highlight: #1fa080;
    --mediumBackground: #f5f5f5;
    --background: #fff;
    --logo-rect-fill: #2D2D2D;
    --logo-rect-opacity: 1;
    --white: #fff;
    --black: #333;
}

/* High Contrast Mode */
body.high-contrast {
    --borders: #000;
    --postColor: #000;
    --texts: #000;
    --highlight: #0000ff;
    --mediumBackground: #ffff00;
    --background: #fff;
    --logo-rect-fill: #000;
    --logo-rect-opacity: 1;
    --white: #fff;
    --black: #000;
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
