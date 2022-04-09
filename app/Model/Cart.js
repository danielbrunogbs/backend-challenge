const grpc = require('@grpc/grpc-js');
const loader = require('@grpc/proto-loader');
const fs = require('fs');

class Cart
{
	constructor()
	{
		/* Realiza a leitura do banco do carrinho */

		let file = './cart.json';

		if(!fs.existsSync(file))
			throw new RequestException('Banco do carrinho não localizado!', 404);

		this.file = JSON.parse(fs.readFileSync(file).toString('utf8'));
	}

	async add(product)
	{
		/* Processa o arquivo proto */

		let protoFile = loader.loadSync('./discount.proto');

		let packageProto = grpc.loadPackageDefinition(protoFile).discount;

		let client = new packageProto.Discount('localhost:50051', grpc.credentials.createInsecure());

		let response = client.GetDiscount({ productID: parseInt(product.id) }, (err, response) => {

			console.log(response);

		});
	}
}

module.exports = Cart;