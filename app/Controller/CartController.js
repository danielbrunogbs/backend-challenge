const RequestException = require('../Exception/RequestException.js');
const Cart = require('../Model/Cart.js');
const Product = require('../Model/Product.js');

function index(req, res, next)
{
	try
	{
		let cart = new Cart();

		return res.status(200).send({ cart: cart.all() });
	}
	catch(e)
	{
		next(e);
	}
}

async function add(req, res, next)
{
	try
	{
		if(!req.body || !req.body.products)
			throw new RequestException('É necessário informar uma lista de produtos!', 422);

		let cart = new Cart();

		req.body.products.forEach(item => {

			if(!item.id || !item.quantity)
				throw new RequestException('É necessário informar todos os campos para adicionar o produto no carrinho!', 422);

			let product = new Product();

			cart.add(product.find(item.id), parseInt(item.quantity));

		});

		await cart.save();

		return res.status(200).send({ cart: cart.all(), message: 'Produtos adicionados no carrinho!' });
	}
	catch(e)
	{
		next(e);
	}
}

module.exports = { add, index };