# Buscador de CEP

Aplicação web que permite ao usuário buscar endereços a partir de um **CEP** ou localizar um **CEP** a partir de um **endereço** completo (estado, cidade e rua). Além de exibir as informações textuais, o sistema localiza o ponto correspondente em um **mapa interativo**, destacando a área aproximada do CEP.

## ✨ Funcionalidades

- Busca de endereço a partir de um **CEP**
- Busca de CEP a partir de um **endereço**
- Exibição do local no **mapa** com marcação visual
- Destaque da área aproximada do CEP com um **retângulo geográfico**
- Interface responsiva com **HTML**, **TailwindCSS** e **JavaScript**

## 🎥 Demonstração
<img src="./src/assets/gif_desktop_1.gif"/>  
<img src="./src/assets/gif_desktop_2.gif"/>

## 🧩 Tecnologias Utilizadas

- **HTML** + **TailwindCSS**
- **JavaScript** (módulos e scripts tradicionais)
- **[ViaCEP API](https://viacep.com.br/)** para dados de CEP
- **[LocationIQ API](https://locationiq.com/)** para geocodificação e visualização no mapa

## 🚀 Acesso ao Projeto

O projeto é acessado apenas pelo link **[CepMap](https://cepmap.netlify.app/)**

## ⚙️ Rodar localmente

### Pré-requisitos

- Chave da API LocationIQ (gratuita em [https://locationiq.com](https://locationiq.com))
- Node.js instalado (para usar o Netlify CLI)
- Netlify CLI instalado globalmente (ver passo 4)

### Passos para rodar localmente

1. Clone o repositório:

```powershell
git clone https://github.com/guilhermegodoydev/buscador-cep.git
cd buscador-cep
```

2. Copie o arquivo de variáveis de ambiente e adicione sua chave:

```powershell
copy .env.example .env
```

3. Abra o arquivo .env em um editor de texto e substitua LOCATIONIQ pela sua chave real.

4. Instale o Netlify CLI globalmente (se ainda não tiver):

```powershell
npm install -g netlify-cli
```

5. Rode o servidor local com Netlify CLI para ativar as funções serverless:

```powershell
netlify dev
```

6. Abra o navegador no endereço que o Netlify CLI indicar (normalmente http://localhost:8888).

### Observações

- Sem rodar o Netlify CLI (ou sem deploy no Netlify), as funções proxy não funcionarão e o mapa pode não carregar.

- Se quiser ver apenas o front-end sem mapa, pode abrir o arquivo index.html diretamente no navegador, mas as funcionalidades do mapa ficarão limitadas.

- A chave da API LocationIQ é necessária para a exibição dos mapas. Você pode obter uma chave gratuita no site oficial.
