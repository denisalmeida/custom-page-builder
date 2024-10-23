# Ambienz_CustomPageBuilder

Módulo que visa implementar novas features e customizações no page builder do magento.

## Descrição

O CustomPageBuilder é um módulo que visa adicionar novas features e expandir as funcionalidades do page builder do Magento 2.

## Features

### 1. Anchor - Content Type

Em um cenário hipotético: o time de marketing cria uma bela landing page no pagebuilder com várias seções, e logo surge a necessidade de criar um menu de navegação âncora para rolar entre as seções.

Atualmente fazer isto só tem dois caminhos: através de desenvolvimento no frontend (que envolve deploy), ou no próprio page builder através do content type HTML que exige conhecimento de HTML, CSS e JS, tornando sua implementação e gestão inviável pelo time de marketing ou negócio, fazendo com que sempre dependam do time de tech.

Esta feature visa resolver este desafio, implementando o content type **Anchor** menu de navegação âncora de fácil criação, personalização e gestão.

>**Importante:** O Módulo ainda esta em fase de desenvolvimento, não recomendamos fazer uso em ambiente de produção.

#### Características:

- **Live edit:** Edite facilmente o nome do anchor item em abrir a configuração.
- **Drag and drop:**  Organize livremente os items arrastando e soltando.
- **Smooth scroll:** Rolagem suave entre as seções.
- **Visibility:** Exiba ou oculte itens do menu.
- **Custom anchor link:** Customize os links e o id das seções.
- **Custom styles:** Altere a cor de fundo, cor dos items.
- **Sticky:** Fixe o menu no topo ou footer.

#### Amostra:
O módulo cria uma página de amostra com várias multiplas seções com identificador `custom-pagebuilder-example-page`.

#### Uso:

- Com page builder aberto em alguma página ou bloco.
- Clique em "Adicionar conteúdo" e selecione e arraste "Anchor" para a row desejada.
- Customize seu menu âncora com diversas opções.

## Instalação

Para instalar o módulo, siga os passos abaixo:

- Clone o repositório `git@github.com:denisalmeida/magento2-module-custom-pagebuilder.git` na pasta `app/code`.
- Execute o comando `composer install` para instalar as dependências.
- Execute o comando `bin/magento module:enable Ambienz_CustomPageBuilder` para habilitar o módulo.
- Execute o comando `bin/magento setup:upgrade` para atualizar o Magento.


## License

Copyright © 2024 [Denis Almeida](https://denisalmeida.com).

This project is [MIT](https://github.com/denisalmeida/magento2-module-custom-pagebuilder/blob/master/LICENSE) licensed.

---

# Authors

*   [Denis Almeida](https://denisalmeida.com)
*   [Ambienz by Denis Almeida](https://ambienz.com.br)
