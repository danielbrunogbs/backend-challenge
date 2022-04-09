const Product = require('../Model/Product.js');

function index(req, res, next)
{
	try
	{
		let product = new Product();

		return res.send({ products: product.all() });
	}
	catch(e)
	{
		next(e);
	}
}

function show(req, res, next)
{
	try
	{
		let product = new Product();

		return res.send({ product: product.find(req.params.id) });
	}
	catch(e)
	{
		next(e);
	}
}

module.exports = { index, show };