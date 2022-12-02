#!/usr/bin/env node

const amqp = require('amqplib/callback_api');

const configReader = require('./configReader')

let rabbitMqUrl = configReader.get_rabbitmq_url();

console.log(`rabbitMqUrl is ${rabbitMqUrl}`);

amqp.connect(rabbitMqUrl, function (error0, connection) {
    
    if (error0) {
        throw error0;
    }

    connection.on("error", function (err) {
        if (err.message !== "Connection closing") {
            console.error("[AMQP] conn error", err.message);
        }
    });
    
    console.log("[AMQP] connected");

    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'hellonode';
        var msg = 'Hello World!';

        channel.assertQueue(queue, {
            durable: false
        });
        channel.sendToQueue(queue, Buffer.from(msg));

        console.log(" [x] Sent %s", msg);
    });
    setTimeout(function () {
        connection.close();
        process.exit(0);
    }, 500);
});
