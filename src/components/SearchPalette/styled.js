import styled from "styled-components"

export const Backdrop = styled.div`
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: flex;
  justify-content: center;
  padding: 12vh 12px 24px;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
`

export const Panel = styled.div`
  width: 100%;
  max-width: 620px;
  align-self: flex-start;
  overflow: hidden;
  background: var(--background);
  border: 1px solid var(--borders);
  border-radius: 12px;
  box-shadow: 0 16px 50px rgba(0, 0, 0, 0.4);
`

export const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--borders);

  svg {
    flex: 0 0 auto;
    width: 1.15rem;
    height: 1.15rem;
    color: var(--muted);
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.75;
  }
`

export const SearchInput = styled.input`
  min-width: 0;
  flex: 1;
  padding: 0;
  color: var(--postColor);
  font-family: var(--font-body);
  font-size: 1rem;
  background: transparent;
  border: 0;
  outline: 0;

  &::placeholder {
    color: var(--muted);
  }
`

export const Shortcut = styled.kbd`
  flex: 0 0 auto;
  padding: 3px 6px;
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  line-height: 1;
  background: transparent;
  border: 1px solid var(--borders);
  border-radius: 4px;
`

export const Results = styled.div`
  max-height: min(55vh, 460px);
  overflow-y: auto;
`

export const ResultRow = styled.button`
  display: block;
  width: 100%;
  padding: 10px 20px;
  color: var(--postColor);
  text-align: left;
  background: ${props =>
    props.$selected ? "var(--mediumBackground)" : "transparent"};
  border: 0;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background: var(--mediumBackground);
    outline: 0;
  }

  &:hover strong,
  &:focus-visible strong {
    color: var(--highlight);
  }
`

export const ResultTitle = styled.strong`
  display: block;
  color: ${props =>
    props.$selected ? "var(--highlight)" : "var(--postColor)"};
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 600;
`

export const ResultMeta = styled.span`
  display: block;
  margin-top: 3px;
  overflow: hidden;
  color: var(--muted);
  font-size: 0.8125rem;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Status = styled.div`
  padding: 14px 20px;
  color: var(--muted);
  font-size: 0.875rem;
`

export const FooterHint = styled.div`
  padding: 12px 20px;
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  border-top: 1px solid var(--borders);

  @media (max-width: 768px) {
    font-family: var(--font-body);
    text-align: center;
  }
`

export const DesktopHint = styled.span`
  @media (max-width: 768px) {
    display: none;
  }
`

export const MobileHint = styled.span`
  display: none;

  @media (max-width: 768px) {
    display: inline;
  }
`
