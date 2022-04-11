const RequestException = require('../Exception/RequestException.js');
const Cart = require('../Model/Cart.js');
const Product = require('../Model/Product.js');
const moment = require('moment');

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
		let { products } = req.body;

		for(let i = 0; i < products.length; i++)
		{
			if(!products[i].id || !products[i].quantity)
				throw new RequestException('É necessário informar todos os campos para adicionar o produto no carrinho!', 422);

			let product = new Product();

			await cart.add(product.find(products[i].id), parseInt(products[i].quantity));
		}

		/*
		* Regra número 3
		*
		* Deverá ser verificado se é black friday e caso seja, você 
		* deve adicionar um produto brinde no carrinho.
		*
		* Obs: Até o momento, não foi informado para ser realizar o calculo de desconto no produto brinde.
		*/

		if(!process.env.BLACK_FRIDAY || !moment(process.env.BLACK_FRIDAY).isValid())
			throw new RequestException('Data de Black Friday não identificada!', 422);

		let now = moment().format('YYYY-MM-DD');

		/*
		* Regra número 4
		*
		* Deverá existir apenas uma entrada de produto brinde no carrinho.
		*/

		if(moment(now).isSame(process.env.BLACK_FRIDAY) && !cart.hasGift())
		{
			let gift = new Product();
			gift = gift.gift();

			if(gift)
				await cart.add(gift, 1);
			else
				console.log('Não há nenhum produto brinde para adicionar!');
		}

		/* Salva todas as alterações realizadas no carrinho */

		await cart.save();

		return res.status(200).send({ cart: cart.all(), message: 'Produtos adicionados no carrinho!' });
	}
	catch(e)
	{
		next(e);
	}
}

module.exports = { add, index };