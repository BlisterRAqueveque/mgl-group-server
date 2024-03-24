import {
  createBot,
  createFlow,
  MemoryDB,
  createProvider,
  addKeyword,
} from "@bot-whatsapp/bot";
import { BaileysProvider, handleCtx } from "@bot-whatsapp/provider-baileys";
//! El problema con esta librería, es que los mensajes enviados no se guardan en el chat en sí
/** @description Podemos crear mensajes personalizados de respuesta automática */
//const welcome = addKeyword("Hola").addAnswer("Buenas!");
const main = async () => {
  const provider = createProvider(BaileysProvider);
  provider.initHttpServer(3002)
  provider.http?.server.post('/send-message', handleCtx(async (bot, req, res) => {
    const body = req.body as {phone: string, message: string, mediaUrl: string}
    await bot.sendMessage(body.phone, body.message, {
      media: body.mediaUrl
    })
    res.end('Message sent')
  }))
  await createBot({
    flow: createFlow([]),
    database: new MemoryDB(),
    provider,
  });
};
main();
