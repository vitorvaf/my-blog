import styled from "styled-components"

export const ProgressBarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: transparent;
  z-index: 9999;
`

export const ProgressBar = styled.div`
  height: 100%;
  background: var(--highlight);
  transition: width 0.1s ease;
  box-shadow: 0 0 8px var(--highlight);
`
