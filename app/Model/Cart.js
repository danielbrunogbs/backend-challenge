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

		console.log('O construtor foi executado!');
	}

	async add(product, quantity)
	{
		return new Promise(async (resolve, reject) => {

			/* Se conecta com o serviço de desconto para pegar a porcentagem */

			let service = new DiscountService();
			let discount = 0;

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

	all()
	{
		return this.cart;
	}

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

	find(id)
	{
		return this.cart.find(item => parseInt(item.id) === parseInt(id));
	}
}

module.exports = Cart;