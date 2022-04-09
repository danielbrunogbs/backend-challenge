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

	async add(product, quantity)
	{
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

		/* Calcula a quantidade de porcentagem por quantidade de produto */

		discount = discount * quantity;
		discount = (((product.amount * quantity) / 100) / 100) * discount;

		product.amount = ((product.amount / 100) - discount).toFixed(2) * 100;
		product.quantity = quantity;

		this.cart.push(product);

		fs.writeFileSync(this.file, JSON.stringify(this.cart), { flag: 'w' });
	}

	all()
	{
		return this.cart;
	}
}

module.exports = Cart;