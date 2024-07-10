const express = require('express');
const amqp = require('amqplib');
const app = express();

app.use(express.json());

async function conectarRabbitMQ(queue) {
    const conn = await amqp.connect('amqp://guest:guest@localhost');
    const channel = await conn.createChannel();
    await channel.assertQueue(queue, { durable: true });
    return channel;
}

app.listen(3001, () => {
    console.log('document_api escuchando en el puerto 3001');

    startConsumer();
});

async function startConsumer() {
    const channel = await conectarRabbitMQ('Cola_Principal_de_Envio');

    console.log('Esperando mensajes en la cola', 'para recibir documentos');

    await channel.prefetch(1); // Extrae solo un mensaje

    channel.consume('Cola_Principal_de_Envio', async (msg) => {
        if (msg !== null) {
            const messageContent = JSON.parse(msg.content.toString());
            console.log('Mensaje recibido:', messageContent);

            try {
                const processedDocument = await processAsync(messageContent);
                // Confirma que el mensaje ha sido recibido y procesado
                channel.ack(msg);
            } catch (error) {
                console.error('Error al procesar el mensaje:', error);
                // En caso de error, no confirmar el mensaje para que pueda ser reintentado
                channel.nack(msg);
            }
        }
    }, {
        noAck: false
    });
}

 function processAsync(document) {
    return new Promise( (resolve, reject) => {
        const randomPercentage = Math.floor(Math.random() * 100) + 1;
        document.porcentaje = randomPercentage;
        document.status = "Procesando";
        console.log('Estado actualizado a Procesando:', document);

        let count = 0;
        const intervalId = setInterval( async() => {
            if (count >= 1) {
                clearInterval(intervalId);
                if (randomPercentage < 80) {
                    document.status = "Rechazado";
                } else {
                    document.status = "Aceptado";
                }
                await sendMensage('Cola_de_respuesta', document);
                resolve(document); // Resolve la promesa con el documento actualizado
            } else {
                document.status = "Procesando";
                await sendMensage('Cola_de_respuesta', document);
                console.log('Procesamiento en progreso:', document);
                count++;
            }
        }, 3000);
    });
}

async function sendMensage(queue, document) {
    const channel = await conectarRabbitMQ(queue);

    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(document)));
}
