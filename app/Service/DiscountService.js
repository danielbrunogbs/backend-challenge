const grpc = require('@grpc/grpc-js');
const loader = require('@grpc/proto-loader');

class DiscountService
{
	constructor()
	{
		/* Processa o arquivo .proto */

		let protoFile = loader.loadSync('./discount.proto');

		let packageProto = grpc.loadPackageDefinition(protoFile).discount;

		this.client = new packageProto.Discount('localhost:50051', grpc.credentials.createInsecure());
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