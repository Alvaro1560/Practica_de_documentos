
const express = require('express');
const amqp = require('amqplib');
const app = express();



app.use(express.json());






const arrayDocuments = [
    {
        id: "001",
        name: "doc1",
        status: 'pendiente',
        porcentaje: 0
    },
    {
        id: "002",
        name: "doc2",
        status: 'pendiente',
        porcentaje: 0
    },
    {
        id: "003",
        name: "doc3",
        status: 'pendiente',
        porcentaje: 0
    }
    
]

async function conectarRabbitMQ(queue) {
    const conn = await amqp.connect('amqp://guest:guest@localhost');
    const channel = await conn.createChannel();
    await channel.assertQueue(queue, { durable: true });
    return channel;
}


app.listen(3000, () => {
    console.log('document_api escuchando en el puerto 3000');

    sendMensage(arrayDocuments);
});

async function sendMensage(documents){

    const channel = await conectarRabbitMQ("Cola_Principal_de_Envio");

    documents.forEach( async (element) => {
        await channel.sendToQueue("Cola_Principal_de_Envio", Buffer.from(JSON.stringify(element)));
        console.log(element)
     });

     getStatus();

}

async function getStatus() {
    const channel = await conectarRabbitMQ("Cola_de_respuesta");

    await channel.prefetch(1); // extrae solo un mensaje (notificacion)
    channel.consume("Cola_de_respuesta", (msg) => {
        if (msg !== null) {
            const messageContent = JSON.parse(msg.content.toString());
            console.log('Notificacion del estado del documento');
            console.log("Resultado: ", messageContent)

            channel.ack(msg);
        }
    }, {
        noAck: false
    });
}