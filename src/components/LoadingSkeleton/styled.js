import styled, { keyframes } from "styled-components"

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`

export const SkeletonWrapper = styled.div`
  padding: 2rem;
  animation: fadeIn 0.3s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

const SkeletonBase = styled.div`
  background: linear-gradient(
    90deg,
    var(--borders) 0%,
    var(--mediumBackground) 50%,
    var(--borders) 100%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite linear;
  border-radius: 4px;
  margin-bottom: 1rem;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const SkeletonTitle = styled(SkeletonBase)`
  height: 3rem;
  width: 60%;
`

export const SkeletonText = styled(SkeletonBase)`
  height: 1rem;
  width: ${props => props.width || "100%"};
`
