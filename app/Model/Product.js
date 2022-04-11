const fs = require('fs');
const RequestException = require('../Exception/RequestException.js');

class Product
{
	constructor()
	{
		let file = './products.json';

		if(!fs.existsSync(file))
			throw new RequestException('Banco dos produtos não localizado!', 404);

		this.file = JSON.parse(fs.readFileSync(file).toString('utf8'));
	}

	all()
	{
		return this.file.filter(item => item.is_gift !== true);
	}

	find(id)
	{
		let product = this.file.find(item => parseInt(item.id) === parseInt(id));

		if(!product)
			throw new RequestException(`Produto não localizado! (id: ${id})`, 404);

		/*
		* Regra número 3
		*
		* ... Lembrando que os produtos brindes possuem a flag is_gift = true e não devem ser aceitos 
		* em requisições para adicioná-los ao carrinho (em uma loja virtual, esse produto não deveria
		* ir para "vitrine") ...
		*/

		if(product.is_gift)
			throw new RequestException(`O produto informado não está disponível! (id: ${id})`, 422);

		return product;
	}

	gift()
	{
		return this.file.find(item => item.is_gift === true);
	}
}

module.exports = Product;