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
		return this.file;
	}

	find(id)
	{
		let product = this.file.find(item => parseInt(item.id) === parseInt(id));

		if(!product)
			throw new RequestException(`Produto não localizado! (id: ${id})`, 404);

		return product;
	}
}

module.exports = Product;