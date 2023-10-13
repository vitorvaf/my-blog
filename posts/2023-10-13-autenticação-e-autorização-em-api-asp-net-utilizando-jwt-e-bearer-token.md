---
title: Autenticação e autorização em Api ASP.NET utilizando JWT e Bearer Token
description: Principais conceitos de segurança e autenticação aplicados em uma
  api desenvolvida em .Net Core.
date: 2023-10-13 11:15:56
image: assets/img/images.jpeg
category: dev
background: "#637a91"
---
## 1. Introdução ao JWT e Bearer Token

No mundo digital de hoje, garantir a segurança das informações é crucial. JWT (JSON Web Tokens) e Bearer Tokens são dois componentes essenciais nesse cenário. O JWT é um padrão compacto e autocontido para transmitir informações entre partes, enquanto o Bearer Token é uma forma de enviar esse JWT.

- - -

## 2. Componentes do JWT

Um JWT é composto por três partes:

* **Header**: Define o tipo do token e o algoritmo de assinatura usado.
* **Payload**: Contém declarações sobre uma entidade, geralmente o usuário, e metadados adicionais.
* **Signature**: Garante a integridade do token e valida o remetente.

- - -

## 3. Autenticação vs. Autorização

Enquanto a autenticação verifica a identidade de um usuário, a autorização determina as ações que um usuário autenticado pode realizar. O JWT serve como um meio eficaz de realizar ambas as tarefas, armazenando informações de identidade e permissões.

- - -

## 4. Configurando JWT em ASP.NET Core

Para integrar JWT em uma API ASP.NET Core:

* Instale os pacotes necessários via NuGet.\
  
Primeiro, instale o pacote necessário via NuGet:

  ```bash
  Install-Package Microsoft.AspNetCore.Authentication.JwtBearer
  ```
* Configure o middleware de autenticação JWT no `Startup.cs`.

No arquivo Startup.cs, adicione o seguinte:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = Configuration["Jwt:Issuer"],
                ValidAudience = Configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]))
            };
        });
}

public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    app.UseAuthentication();
    app.UseAuthorization();
}

```
* Gere tokens JWT após uma autenticação bem-sucedida, que serão enviados ao cliente.

Após a autenticação bem-sucedida, você pode gerar um token JWT:

```csharp
private string GenerateJSONWebToken(UserInfo userInfo)
{
    var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]));
    var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(Configuration["Jwt:Issuer"],
        Configuration["Jwt:Audience"],
        null,
        expires: DateTime.Now.AddMinutes(120),
        signingCredentials: credentials);

    return new JwtSecurityTokenHandler().WriteToken(token);
}
```

- - -

## 5. Validação e Uso do Bearer Token

Os tokens JWT são geralmente enviados em solicitações HTTP através do cabeçalho de autorização, precedidos pela palavra "Bearer". A API, ao receber o token, valida-o antes de processar a solicitação.

Quando o cliente envia uma solicitação, ele deve incluir o token JWT no cabeçalho de autorização:

```http
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

- - -

## 6. Gestão de Tokens

A gestão eficaz de tokens envolve:

Expiração

No exemplo anterior, definimos a expiração do token para 120 minutos. Isso é feito com expires: DateTime.Now.AddMinutes(120).

### Renovação

Para renovar tokens, você pode criar um endpoint que aceite um token válido e retorne um novo token com uma nova data de expiração.

### Armazenamento Seguro

No lado do cliente, é recomendado armazenar tokens em um cookie HttpOnly ou em um armazenamento de sessão, dependendo das necessidades da aplicação.

- - -

## 7. Segurança

A segurança é primordial ao lidar com JWT:

### HTTPS

Garanta que sua API esteja servindo conteúdo via HTTPS. No ambiente de desenvolvimento, o ASP.NET Core usa HTTPS por padrão.

### Chave Secreta

Nunca exponha sua chave secreta e considere usar o Azure Key Vault ou soluções semelhantes para armazenar chaves em produção.

- - -

## 8. Considerações sobre desempenho

O JWT oferece vantagens de desempenho devido à sua natureza sem estado, permitindo escalabilidade. No entanto, é essencial estar ciente do tamanho crescente do token, especialmente se muitas informações forem armazenadas nele.
O tamanho do token pode afetar o desempenho, especialmente se você estiver incluindo muitas reivindicações. Monitore o tamanho do seu token e considere soluções alternativas, como dividir as informações entre o token e o servidor, se necessário.

- - -

## 9. Conclusão

A autenticação e autorização são pilares da segurança em aplicações modernas. Ao usar JWT e Bearer Tokens em APIs ASP.NET Core, os desenvolvedores podem garantir uma comunicação segura e eficiente entre o cliente e o servidor.

- - -

## 10. Referências

* [Documentação oficial do JWT](https://jwt.io/)
* [Guia da Microsoft para autenticação e autorização em ASP.NET Core](https://docs.microsoft.com/pt-br/aspnet/core/security/)