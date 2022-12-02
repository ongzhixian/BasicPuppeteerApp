#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

const configReader = require('./configReader')

let rabbitMqUrl = configReader.get_rabbitmq_url();

console.log(`rabbitMqUrl is ${rabbitMqUrl}`);

amqp.connect(rabbitMqUrl, function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'hellonode';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function(msg) {
            console.log(" [x] Received %s", msg.content.toString());
        }, {
            noAck: true
        });
    });
});
