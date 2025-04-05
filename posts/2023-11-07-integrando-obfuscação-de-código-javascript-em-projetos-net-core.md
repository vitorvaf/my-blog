---
title: "Ofuscação de Código JavaScript em Projetos .NET Core com a biblioteca
  JavaScript Obfuscator "
description: Este artigo explora a integração eficaz da ofuscação de código
  JavaScript em projetos .NET Core.
date: 2023-11-07T08:44:51.000Z
image: assets/img/javascript-obfuscator.webp
category: dev
background: "#637a91"
---
**Introdução:**

A ofuscação de código é uma prática essencial para proteger a propriedade intelectual e a segurança de aplicações web. Em projetos .NET Core, a inclusão de scripts JavaScript pode apresentar um vetor para engenharia reversa e exploração de vulnerabilidades. Este artigo explora uma abordagem robusta para integrar a obfuscação de código JavaScript em projetos .NET Core, utilizando a biblioteca `javascript-obfuscator` e automatizando o processo através do arquivo de projeto (.csproj) e do Dockerfile.

**Utilizando `javascript-obfuscator` com Node.js:**

A biblioteca `javascript-obfuscator` é uma ferramenta baseada em Node.js que proporciona um alto nível de ofuscação. Para integrá-la em um projeto .NET Core, primeiro é necessário criar um ambiente Node.js. Isso é feito adicionando um arquivo `package.json` ao projeto, que define o script `obfuscate`:

```json
{
  "scripts": {
    "obfuscate": "node javascript-obfuscate.js"
  }
}
```

\
O script `javascript-obfuscate.js` é um arquivo Node.js que importa a biblioteca `javascript-obfuscator` e aplica a ofuscação ao código JavaScript desejado:

```javascript
const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

// Caminho para o arquivo JavaScript original
const originalJsPath = path.join(__dirname, 'wwwroot', 'js', 'meu-script.js');
// Caminho para o arquivo JavaScript ofuscado
const obfuscatedJsPath = path.join(__dirname, 'wwwroot', 'js', 'meu-script.ofuscado.js');

// Ler o código fonte JavaScript
const jqueryCode = fs.readFileSync(originalJsPath, 'utf-8');

// Ofuscar o código
const obfuscatedCode = JavaScriptObfuscator.obfuscate(jqueryCode, {
  compact: true,
  controlFlowFlattening: true
});

// Escrever o código ofuscado no novo arquivo
fs.writeFileSync(obfuscatedJsPath, obfuscatedCode.getObfuscatedCode());
```

\
**Automatização com o Arquivo .csproj:**

Para automatizar o processo de ofuscação, o arquivo `.csproj` do projeto .NET Core pode ser configurado para executar o script de ofuscação como parte do processo de build. Isso é feito adicionando um Target que chama o script `npm run obfuscate`:

```xml
<Target Name="ObfuscateJavaScript" BeforeTargets="Build">
  <Exec Command="npm run obfuscate" />
</Target>
```

\
**Alterações no Dockerfile:**

Para que o processo de ofuscação funcione dentro de um contêiner Docker, o Dockerfile deve ser atualizado para incluir o Node.js e suas dependências. Isso é realizado com os seguintes comandos:

```dockerfile
# Instalar Node.js
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs

# Instalar dependências do Node.js especificadas no package.json
COPY package.json ./
RUN npm install
```

\
\
Esses comandos garantem que o ambiente Docker tenha o Node.js instalado e que todas as dependências necessárias estejam presentes para executar o script de ofuscação.

**Conclusão:**

A integração da obfuscação de código JavaScript em projetos .NET Core adiciona uma camada valiosa de segurança e proteção de propriedade intelectual. Ao automatizar esse processo através do arquivo `.csproj` e adaptar o Dockerfile para suportar o ambiente Node.js, os desenvolvedores podem garantir que o código JavaScript seja ofuscado de forma consistente e eficaz em cada build, sem interrupção do fluxo de trabalho existente. Embora a ofuscação não seja infalível, ela serve como um obstáculo significativo contra tentativas casuais de leitura e compreensão do código-fonte, contribuindo para a segurança geral da aplicação.

**Referências:**

1. **Documentação Oficial da Biblioteca `javascript-obfuscator`:**

   * [javascript-obfuscator no GitHub](https://github.com/javascript-obfuscator/javascript-obfuscator)
   * Esta é a fonte primária para entender as capacidades e opções de configuração da biblioteca `javascript-obfuscator`.
2. **Guia de Integração do MSBuild:**

   * [MSBuild Documentation](https://docs.microsoft.com/en-us/visualstudio/msbuild/msbuild)
   * A documentação oficial do MSBuild da Microsoft oferece um guia detalhado sobre como criar e configurar tarefas de build personalizadas.
3. **Docker e .NET Core:**

   * [Dockerize an ASP.NET Core application](https://docs.docker.com/samples/dotnetcore/)
   * Este guia da Docker fornece instruções sobre como containerizar uma aplicação .NET Core.
4. **Artigos e Tutoriais de Ofuscação de Código:**

   * [A Beginner's Guide to Obfuscating JavaScript](https://www.sitepoint.com/javascript-obfuscation/)
   * Um guia introdutório para entender a ofuscação de JavaScript e por que ela é importante.
5. **Referências sobre o MSBuild e Docker:**

   * [Using MSBuild and Docker Together](https://www.stevejgordon.co.uk/using-docker-with-msbuild-projects)
   * Um artigo que explora como usar o MSBuild e o Docker juntos, o que pode ser relevante para a parte do Dockerfile do seu artigo.