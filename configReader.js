const fs = require('fs');
const path = require('path');

function getCloudAmqpConfigurationFilePath()
{
    if (!process.env.hasOwnProperty('USERPROFILE'))
    {
        console.log("USERPROFILE is not defined");
        return null;
    }

    let config_file_path = path.join(process.env.USERPROFILE, '.cloudampq.json')

    return config_file_path;
}

function getCloudAmqpConfiguration()
{
    let config_file_path = getCloudAmqpConfigurationFilePath();

    try {
        const data = fs.readFileSync(config_file_path, 'utf8');
        return data;
      } catch (err) {
        console.error(err);
      }
}


function get_rabbitmq_url() {

    let rabbitMqConfigJson = getCloudAmqpConfiguration();
    
    let rabbitMqConfig = JSON.parse(rabbitMqConfigJson)
    
    if (rabbitMqConfig.hasOwnProperty('cloud_amqp')
        && rabbitMqConfig['cloud_amqp'].hasOwnProperty('armadillo')
        && rabbitMqConfig['cloud_amqp']['armadillo'].hasOwnProperty('url'))
        return rabbitMqConfig['cloud_amqp']['armadillo']['url'];

    return null;
}

module.exports = {
    get_rabbitmq_url
};
