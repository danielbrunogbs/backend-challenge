const Product = require('../Model/Product.js');

function index(req, res, next)
{
	try
	{
		let product = new Product();

		return res.status(200).send({ products: product.all() }, 200);
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

		return res.status(200).send({ product: product.find(req.params.id) }, 200);
	}
	catch(e)
	{
		next(e);
	}
}

module.exports = { index, show };