import React, { useState, useEffect} from "react"

import { Home } from "@styled-icons/boxicons-solid/Home"
import { SearchAlt2 as Search } from "@styled-icons/boxicons-regular/SearchAlt2"
import { UpArrowAlt as Arrow } from "@styled-icons/boxicons-regular/UpArrowAlt"
import { LightBulb as Light } from "@styled-icons/entypo/LightBulb"
import { Grid } from "@styled-icons/boxicons-solid/Grid"
import { ThList as List } from "@styled-icons/typicons/ThList"

import getThemeColor from '../../utils/getThemeColor'

import * as S from "./styled"

const MenuBar = () => {
  const[theme, setTheme] = useState(null);
  const[display, setDisplay] = useState(null);


  const isDarkMode = theme === "dark";
  const islistMode= display === "list";

  useEffect(() => {
    setTheme(window.__theme);
    setDisplay(window.__display)
    window.__onThemeChange = () => setTheme(window.__theme);
    window.__onDisplayChange = () => setDisplay(window.__display);
  }, [])

  return (
    <S.MenuBarWrapper>
      <S.MenuBarGroup>
        <S.MenuBarLink to="/" cover direction="right" bg={getThemeColor()} duration={0.6} title="Voltar para a Home" aria-label="Ir para página inicial">
          <S.MenuBarItem aria-hidden="true">
            <Home />
          </S.MenuBarItem>
        </S.MenuBarLink>
        <S.MenuBarLink to="/search" cover direction="right" bg={getThemeColor()} duration={0.6} title="Pesquisar" aria-label="Pesquisar no blog">
          <S.MenuBarItem aria-hidden="true">
            <Search />
          </S.MenuBarItem>
        </S.MenuBarLink>
      </S.MenuBarGroup>
      <S.MenuBarGroup>
        <S.MenuBarItem
          as="button"
          title="Mudar o tema"
          aria-label={isDarkMode ? "Ativar tema claro" : "Ativar tema escuro"}
          onClick={() => {
            window.__setPreferredTheme(isDarkMode ? 'light' : 'dark')
          }}
          className={theme}
        >
          <Light aria-hidden="true" />
        </S.MenuBarItem>
        <S.MenuBarItem
          as="button"
          title="Mudar visualização"
          aria-label={islistMode ? "Mudar para visualização em grade" : "Mudar para visualização em lista"}
          onClick={()=>{
            window.__setPreferredDisplay(islistMode ? 'grid' : 'list')
          }}
          className="display"
        >
         { islistMode ? <Grid aria-hidden="true" /> : <List aria-hidden="true" /> }
        </S.MenuBarItem>
        <S.MenuBarItem
          as="button"
          title="Ir para o Topo"
          aria-label="Voltar ao topo da página"
          onClick={() => {
            window.scroll({ top: 0, behavior: 'smooth' })
          }}>
          <Arrow aria-hidden="true" />
        </S.MenuBarItem>
      </S.MenuBarGroup>
    </S.MenuBarWrapper>
  )
}

export default MenuBar
