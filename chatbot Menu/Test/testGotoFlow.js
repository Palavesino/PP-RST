const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const flowBienvenida = addKeyword(EVENTS.WELCOME)
    .addAnswer('flowBienvenida', null, async (_, { gotoFlow }) => {
        return gotoFlow(test1_goto);
    })
const test1_goto = addKeyword(EVENTS.ACTION).addAnswer('Flujo 1', null, async (_, { gotoFlow }) => {
    console.log("Entre 1 test1_goto");
    return gotoFlow(test2_goto);
})
const test2_goto = addKeyword(EVENTS.ACTION).addAnswer('Flujo 1', null, async (_, { flowDynamic }) => {
    console.log("Entre 2 test2_goto");
    await flowDynamic([
        {
            body: `▄︻デ══━一💥Bang!! `
        }
    ]);
})
const test_flow = [flowBienvenida, test1_goto, test2_goto];
const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow(test_flow)
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    QRPortalWeb()
}

main()