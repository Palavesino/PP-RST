
/*  ------------ Datos a Tener En Cuenta ---------------------------
* El Metodo gotoFlow no funciona correctamente si el flujo que lo es usando no esta en createFlow 
caso contrario el progrma no reconoce al flujo mismo como flujo de chatBot.
* addAction como bine dice el metodo ejecuta acciones a diferencia de addAnswer este no posee el parametro nested?: any[],
  que vendria a hacer los flujos hijos que el usuario se redirige mediante su respuesta.
*/
const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
let contador = 0;

const flowBienvenida = addKeyword(EVENTS.WELCOME)
    .addAnswer('Bienvenido gotoFlow Recursivo\nIngrese 0 para romper la recursividad', null, async (_, { gotoFlow }) => {
        return gotoFlow(test1_goto);
    })

//------------------------------------Flujo Hijo para Probar ----------------------------------------------
const flowHijo_1 = addKeyword('1')
    .addAnswer('Ingresaste al flow hijo 1', null,
        async (_, { flowDynamic }) => {
            return await flowDynamic([
                {
                    body: `•—⟪=====> `
                }]);
        }
    )
    .addAction(async (_, { flowDynamic }) => {
        return await flowDynamic([
            {
                body: `🛡️ 🤺`
            }]);
    })

// -------------------------------------------------------------------------------------
const test1_goto = addKeyword(EVENTS.ACTION)
    .addAction(async (_, { flowDynamic }) => {
        return await flowDynamic([
            {
                body: `▬▬ι═══════ﺤ Wassh!! `
            }]);
    })
    .addAction(async (_, { gotoFlow }) => {
        console.log('Antes de Entrar')
        return gotoFlow(test2_goto);
    })
// -------------------------------------------------------------------------------------
const test2_goto = addKeyword(EVENTS.ACTION)
    .addAction({ capture: true }, async (ctx, { flowDynamic, gotoFlow }) => {
        const msg = parseInt(ctx.body.toLowerCase().trim());
        if (msg === 0) {
            await flowDynamic([
                {
                    body: `*BREAK RECURSIVE`
                }]);
            return;
        }
        if (msg === 10) {
            return gotoFlow(flowHijo_1);
        }
        contador++;
        await flowDynamic([
            {
                body: `▄︻デ══━一💥Bang!! (${contador})`
            }]);
        return gotoFlow(test2_goto);
    }).addAnswer(null, null, null, [flowHijo_1]); // <----- No funcion porque se le tiene que agregar un answer
// -------------------------------------------------------------------------------------

const test_flow = [flowBienvenida, test1_goto, test2_goto];
console.log(JSON.stringify(test_flow, null, 2))
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