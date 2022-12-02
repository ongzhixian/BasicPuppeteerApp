const configReader = require('./configReader')

let rabbitMqUrl = configReader.get_rabbitmq_url();

console.log(rabbitMqUrl);