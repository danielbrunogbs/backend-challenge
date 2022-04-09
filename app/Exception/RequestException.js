class RequestError
{
	constructor(message, code)
	{
		this.message = message;
		this.http_code = code;
	}
}

module.exports = RequestError;