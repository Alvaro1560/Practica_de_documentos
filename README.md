Ejecuta este comando para instalar rabbitmq desde docker:
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.13-management

![arquitectura documents con rabbitmq](https://github.com/Alvaro1560/Practica_de_documentos/assets/107602096/044dd2e4-a008-460b-8e9f-ae0cd4b16ee2)


colas creadas en rabbit mq y 3 documentos enviados por medio de la cola de envio

![crear cola y enviar mensaje](https://github.com/Alvaro1560/Practica_de_documentos/assets/107602096/ad30d777-2d7f-4492-9c77-508540d0a6a5)

documento procesando para asiganar porcentaje random para cambiar a estado rechazado o aceptado y notificar por la cola de respuesta

![resultado](https://github.com/Alvaro1560/Practica_de_documentos/assets/107602096/7b6e0a7b-0930-4a27-b5fb-a555cf806a25)

