---
title: Publicando gatsby no docker
description: Passo a passo para publicar uma aplicação gatsby em um container
  utilizando o apache
date: 2020-09-09T11:06:36.000Z
image: assets/img/gatsby_docker.png
category: dev
background: "#637a91"
---
O Gatsby é um framework moderno para construção de sites e aplicações web, e o Docker é uma plataforma de contêineres que facilita a implantação de aplicações em qualquer ambiente. Neste guia, vamos aprender como publicar uma aplicação Gatsby no Docker.

## Pré-requisitos

* Conhecimento básico de Gatsby e React.
* Conhecimento básico de Docker.
* Ter o Docker instalado em sua máquina.
* Uma aplicação Gatsby pronta para ser publicada.

## Passo 1: Preparando a Aplicação Gatsby

Antes de mais nada, certifique-se de que sua aplicação Gatsby está funcionando corretamente em seu ambiente local. Execute `gatsby build` para criar uma versão de produção da sua aplicação.

## Passo 2: Criando o Dockerfile

O Dockerfile é um script de configuração que contém todas as instruções necessárias para construir a imagem Docker da sua aplicação. Crie um arquivo chamado `Dockerfile` na raiz do seu projeto Gatsby com o seguinte conteúdo:

```
# Base image
FROM node:alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the Gatsby site
RUN npm run build

# Install `serve` to run the application
RUN npm install -g serve

# Serve the application on port 80
CMD ["serve", "-p", "80", "-s", "public"]
```

Este Dockerfile realiza as seguintes ações:

1. Usa a imagem `node:alpine` como base.
2. Define o diretório de trabalho.
3. Copia os arquivos `package.json` e `package-lock.json`.
4. Instala as dependências do projeto.
5. Copia os arquivos do projeto para o contêiner.
6. Constrói a aplicação Gatsby.
7. Instala o pacote `serve` para servir a aplicação.
8. Define o comando para iniciar a aplicação.

## Passo 3: Construindo a Imagem Docker

Com o Dockerfile pronto, construa a imagem Docker da sua aplicação executando o seguinte comando no terminal:

```
docker build -t minha-aplicacao-gatsby .
```

Este comando cria uma imagem Docker chamada `minha-aplicacao-gatsby` com base no Dockerfile.

## Passo 4: Executando a Aplicação com Docker

Após construir a imagem, você pode executar a aplicação com o seguinte comando:

```
docker run -p 8000:80 minha-aplicacao-gatsby
```

Este comando inicia um contêiner Docker que serve sua aplicação Gatsby na porta 8000 do seu host local.

## Conclusão

Parabéns! Sua aplicação Gatsby agora está rodando dentro de um contêiner Docker. Isso facilita a implantação em qualquer ambiente que suporte Docker, garantindo consistência e facilidade na gestão de dependências.