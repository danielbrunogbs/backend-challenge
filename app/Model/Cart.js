const RequestException = require('../Exception/RequestException.js');
const DiscountService = require('../Service/DiscountService.js');
const fs = require('fs');

class Cart
{
	constructor()
	{
		/* Realiza a leitura do banco do carrinho */

		this.file = './cart.json';

		if(!fs.existsSync(this.file))
			throw new RequestException('Banco do carrinho não localizado!', 404);

		let content = fs.readFileSync(this.file).toString('utf8');
		content = JSON.parse(content);
		content = Array.from(content);

		this.cart = content;
	}

	/* Método para adicionar produtos no carrinho */

	async add(product, quantity)
	{
		return new Promise(async (resolve, reject) => {

			/*
			* Regra número 1
			*
			* Para cada produto você precisará calcular a porcentagem de desconto e isso deve ser feito
			* consumindo um serviço gRPC fornecido por nós para auxiliar no seu teste. Utilize a imagem
			* Docker para subir esse serviço de desconto e o arquivo proto para gerar o cliente na linguagem
			* escolhida. Você pode encontrar como gerar um cliente gRPC nas documentações oficiais da
			* ferramenta e em outros guias encontrados na internet.
			*/

			let service = new DiscountService();
			let discount = 0;

			/*
			* Regra número 2
			*
			* Caso o serviço de desconto esteja indisponível o endpoint de carrinho deverá
			* continuar funcionando porém não vai realizar o cálculo com desconto.
			*/

			try
			{
				discount = await service.GetDiscount(product.id);

				if(discount.percentage)
					discount = discount.percentage;
				else
					discount = 0;
			}
			catch(e)
			{
				console.log(`Não foi possível aplicar o desconto! (Erro: ${e.message})`);
			}

			/* Busca o produto caso ele já tenha sido inserido, para somar futuramente dentro do carrinho */

			let added = this.find(product.id);

			/* Calcula a porcentagem de desconto de acordo com a quantidade do mesmo produto sendo adicionada */

			discount = discount * quantity;

			console.log(`Desconto: % ${discount}`);

			let amount = (product.amount / 100) * quantity;

			console.log(`Valor: R$ ${amount}`);

			discount = amount * discount;

			console.log(`Valor Desconto: R$ ${discount}`);

			amount = (amount - discount).toFixed(2);

			console.log(`Valor Final: R$ ${amount}`);

			amount = amount * 100; //Transformar o valor em centavos

			console.log(`Valor Centavos: ${amount}`);

			product.amount = amount;
			product.quantity = quantity;

			/*
			* Verifica se o produto já foi adicionado no carrinho e altera o mesmo somando os novos valores
			* a taxa é calculada no produto atual sendo inserido, NÃO modificando o anterior, para caso as taxas
			* sejam diferentes.
			*/

			if(added)
			{
				product.amount += added.amount;
				product.quantity += added.quantity;

				this.cart = this.cart.filter(item => parseInt(item.id) !== parseInt(product.id));
			}

			/* Adiciona o produto no carrinho */

			resolve(this.cart.push(product));

		});
	}

	/* Método para trazer todos os produtos do carrinho */

	all()
	{
		return this.cart;
	}

	/* Método para salvar o produto no carrinho */

	save()
	{
		return new Promise((resolve, reject) => {

			fs.writeFile(this.file, JSON.stringify(this.cart), { flag: 'w' }, (err, success) => {

				if(err)
					reject(err);

				resolve(success);

			});

		});
	}

	/* Método para buscar um produto no carrinho */

	find(id)
	{
		return this.cart.find(item => parseInt(item.id) === parseInt(id));
	}

	/* Método que verifica se há produto brinde no carrinho */

	hasGift()
	{
		return this.cart.find(item => item.is_gift === true);
	}
}

module.exports = Cart;