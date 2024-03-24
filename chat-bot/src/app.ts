import {
  createBot,
  createFlow,
  MemoryDB,
  createProvider,
  addKeyword,
} from "@bot-whatsapp/bot";
import { BaileysProvider, handleCtx } from "@bot-whatsapp/provider-baileys";

/** @description Podemos crear mensajes personalizados de respuesta automática */
//const welcome = addKeyword("Hola").addAnswer("Buenas!");
const main = async () => {
  const provider = createProvider(BaileysProvider);

  provider.on('ready', () => {
    console.log('Conectado')
  })
  provider.initHttpServer(3002)
  provider.http?.server.post('/send-message', handleCtx(async (bot, req, res) => {
    const body = req.body as {phone: string, message: string, mediaUrl: string}
    await bot.sendMessage(body.phone, body.message, {
      media: body.mediaUrl
    })
    res.end('Message sent')
  }))

  provider.http.server.post('/disconnect', handleCtx(async(bot,req,res) => {
    // TODO Desconectar el provider
    //! Si se borra la carpeta bot_sessions y se reinicia el servidor, funciona, pero es muy forzado:
    /**
     * import { exec } from "child_process";
     * import * as fs from "fs";
     * //* Borra la carpeta bot_sessions
     * fs.rmdirSync("../bot_sessions", { recursive: true });
     * //* Corre comando, podemos usar pm2, por ejemplo
     * exec("npm run dev", (error, stdout, stderr) => {
     *  if (error) {
     *    console.error(`Error al reiniciar el servidor: ${error.message}`);
     *     return;
     *  }
     *  if (stderr) {
     *    console.error(`stderr: ${stderr}`);
     *     return;
     *  }
     *  console.log(`stdout: ${stdout}`);
     * });
     */
    res.end('Disconnected')
  }))
  await createBot({
    flow: createFlow([]),
    database: new MemoryDB(),
    provider,
  });
};
main();
