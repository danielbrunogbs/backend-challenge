# backend-challenge

### O que é?

Uma API simples utilizando o framework express com NodeJS, na qual disponibiliza alguns produtos para que possa coloca-los no carrinho consultando um microserviço de desconto para cada produto adicionado.

A API também conta com um sistema de BLACK FRIDAY, ao colocar um produto no carrinho ele automaticamente inclui um produto brinde no carrinho sem custo nenhum.

### Porque?

Aplicação desenvolvida com a finalidade de adquirir conhecimento das seguintes ferramentas e linguagens:

- NodeJS
- Docker
- gRPC

### Como funciona?

#### Primeiro Passo

Baixar o respositório utilizando o seguinte comando:

```
git clone https://github.com/danielbrunogbs/backend-challenge.git
```

#### Segundo passo

Na sequência é necessário instalar o **[NodeJS](https://nodejs.org/en/)** e o **[NPM](https://nodejs.org/en/)** (Gerenciador de Pacotes do Node), seguindo as documentações oficiais.

Rodar dentro da raiz do projeto o comando:

```
npm install
```
Para instalar todas as dependência do projeto.

#### Terceiro passo

Você deve instalar o **[Docker](https://www.docker.com/)** seguindo os passos das documentações oficiais.

#### Quarto passo

Você deve criar o arquivo **.env** com base no **.env.example**, o mesmo se repete para o arquivo **cart.json** que deve utilizar como base o **cart.example.json**.
> O arquivo **.env** deve ser configurado de acordo com as suas necessidades.
> 
> Variável **BLACK_FRIDAY** deve conter a data que você deseja utilizar para teste.
> 
> Variável **GRPC_HOST** e **GRPC_PORT** deve conter o IP e PORTA do serviço que vai se conectar.

#### Quinto passo (Final)

Você deve ir na raiz do diretório e executar o seguinte comando:

```
docker-compose up
```

A partir desse momento, o serviço irá ser executado e estará disponível para ser acessado através da porta 8080.

## Endpoints

### **GET /products** - Listagem de produtos

### **GET /product/:id** - Lista um produto específico

> O parâmetro :id deve ser substituído pelo ID do Produto

### **GET /cart** - Lista os produtos inseridos no carrinho

### **POST /cart** - Adiciona um produto no carrinho

**Corpo da requisição:**

```json
{
    "products": [
        {
            "id": 1,
            "quantity": 1
        }
    ]
}
```

**Corpo da resposta:**

```json
{
    "total_amount": 45471,
    "total_amount_with_discount": 45471,
    "total_discount": 0,
    "products": [
        {
            "id": 6,
            "amount": 0,
            "is_gift": true,
            "discount": 0,
            "unity_amount": 0,
            "quantity": 1
        },
        {
            "id": 1,
            "amount": 45471,
            "is_gift": false,
            "discount": 0,
            "unity_amount": 15157,
            "quantity": 3
        }
    ]
}
```

## Integração

Na raiz do projeto, contém um arquivo chamado **backend-challenge.postman_collection**, que pode ser importado no software **[Postman](https://www.postman.com/)** para auxiliar nos testes da API.

## Observações

Para zerar o banco de dados do carrinho, é só limpar o arquivo **cart.json** e deixa-lo no mesmo padrão que o arquivo **cart.example.json**.
