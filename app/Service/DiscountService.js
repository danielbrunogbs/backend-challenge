const RequestException = require('../Exception/RequestException.js');
const grpc = require('@grpc/grpc-js');
const loader = require('@grpc/proto-loader');

class DiscountService
{
	constructor()
	{
		/* Pega o IP e Porta do serviço */

		if(!process.env.GRPC_HOST || !process.env.GRPC_PORT)
			throw new RequestException('Environments não localizadas!', 404);

		this.host = process.env.GRPC_HOST;
		this.port = process.env.GRPC_PORT;

		/* Processa o arquivo .proto */

		let protoFile = loader.loadSync('./discount.proto');

		let packageProto = grpc.loadPackageDefinition(protoFile).discount;

		this.client = new packageProto.Discount(`${this.host}:${this.port}`, grpc.credentials.createInsecure());
	}

	GetDiscount(id)
	{
		return new Promise((resolve, reject) => {

			this.client.GetDiscount({ productID: parseInt(id) }, (err, res) => {

				if(err)
					reject(err);

				resolve(res);

			});

		});
	}
}

module.exports = DiscountService;