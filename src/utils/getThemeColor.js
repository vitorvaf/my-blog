const getThemeCollor = () => {
    const theme = typeof window !== 'undefined' && window.__theme

    if(theme === 'light') return '#fff'
    if(theme === 'dark') return '#232931'

    
}

export default getThemeCollor