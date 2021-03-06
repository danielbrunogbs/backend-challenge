const express = require('express');

/* Controllers */

const ProductController = require('../app/Controller/ProductController.js');
const CartController = require('../app/Controller/CartController.js');

/* Rotas */

const route = express.Router();

/* Produtos */

route.get('/products', ProductController.index);
route.get('/product/:id', ProductController.show);

/* Carrinho */

route.post('/cart', CartController.add);
route.get('/cart', CartController.index);

module.exports = route;