import React, { useState, useEffect } from "react"
import * as S from "./styled"

const ReadingProgress = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrolled = (scrollTop / scrollHeight) * 100
      
      setProgress(scrolled)
    }

    window.addEventListener("scroll", updateProgress)
    updateProgress()

    return () => window.removeEventListener("scroll", updateProgress)
  }, [])

  return (
    <S.ProgressBarContainer aria-hidden="true">
      <S.ProgressBar style={{ width: `${progress}%` }} />
    </S.ProgressBarContainer>
  )
}

export default ReadingProgress
