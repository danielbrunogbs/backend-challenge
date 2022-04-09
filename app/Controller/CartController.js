const RequestException = require('../Exception/RequestException.js');
const Cart = require('../Model/Cart.js');
const Product = require('../Model/Product.js');

function add(req, res, next)
{
	try
	{
		let product = new Product();
		product = product.find(req.params.id);

		let cart = new Cart();

		cart = cart.add(product);

		return res.send({ cart, message: 'Produto adicionado com sucesso no seu carrinho!' });
	}
	catch(e)
	{
		next(e);
	}
}

module.exports = { add };