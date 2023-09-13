# Mia

Nosso sistema interage com duas APIs externas: OpenAI e Figma, para criar tarefas detalhadas e personalizadas. A API da OpenAI produz o contexto e a sequência de passos da tarefa, identificando quais interfaces foram usadas. Os nomes dessas interfaces são capturados e enviados à API do Figma. Depois, nosso sistema verifica se já existe um arquivo Figma relacionado em nosso banco de dados. Caso exista, percorre todas as interfaces e armazena aquelas usadas na explicação da OpenAI em uma lista. A seguir, faz uma nova requisição ao Figma para obter as imagens dessas interfaces. Por fim, as informações obtidas de ambas as APIs são organizadas pela nossa API que retorna uma resposta formatada com as imagens das interfaces, seus nomes, o texto explicativo da tarefa e as imagens correspondentes a cada passo, visíveis nos nomes entre parênteses no fim de cada frase de cada passo. Realizamos uma requisição do tipo POST /ask para a API da Mia para executar todo este processo.

## Instalação

1. Clone este repositório:

   ```
   git clone https://github.com/luizroddev/Mia-Sprint3-Frontend.git
   ```

2. Navegue até o diretório do projeto:

   ```
   cd Mia-Sprint3-Frontend
   ```

3. Instale as dependências:

   ```
   npm install
   ```

## Uso

- Para iniciar a aplicação em um ambiente de desenvolvimento:

  ```
  npm start
  ```

## Funcionalidades

Descreva as funcionalidades principais da sua aplicação, incluindo operações CRUD, se aplicável. Por exemplo:

- **AsyncStorage para validação e armazenamento do Token do usuário para requisições:**
- **Detalhamento sobre como executar tarefas:**

## Licença

Este projeto está licenciado sob a Licença MIT - consulte o arquivo [LICENSE](LICENSE) para obter detalhes.