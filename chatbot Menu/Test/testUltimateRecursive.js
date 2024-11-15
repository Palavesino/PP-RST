/* Este código sirve para recibir un JSON de un Flujo con sus hijos(subMenu flujos) y verificar si tienen hijos para descomponerlos 
y mostrarlos dependiendo de la opción del usuario. Utiliza recursividad para navegar por los subflujos 
y vuelve al flujo inicial cuando se completan todos los subflujos. */

// Importa las bibliotecas necesarias para crear el bot de WhatsApp
const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot');
const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');
const optionMesage = require('../Enum/OptionMessage');

const flowsData = require('../Json/flow2.json');



let messageList = [];
let contador = 0;
let flowCounter = 0;
let childCounter = 0;

// Función para actualizar los contadores de flujo y mensaje
function updateCounters() {
    if ((flowsData[flowCounter].messages.length - 1) === childCounter) {
        flowCounter++;
        childCounter = 0;
    } else {
        childCounter++;
    }
}

const flujoFin = addKeyword(EVENTS.ACTION)
    .addAction(async (_, { endFlow, state }) => {
        contador = 0
        flowCounter = 0
        childCounter = 0
        messageList = []
        await state.update({ showMessage: false })
        return await endFlow();
    });

const subFlujos = addKeyword(EVENTS.ACTION)
    .addAction(async (_, { flowDynamic, state, gotoFlow }) => {
        let message = state.get('message');
        if (message !== null) {
            let body = message.showName
                ? message.body.replace(/\b(name|nombre)\b/gi, state.get('name'))
                : message.body;
            await flowDynamic(body);
            if (message.option !== optionMesage.READ) {
                const showMessage = message.option !== optionMesage.CAPTURE
                    ? state.get('showMessage')
                    : false;
                //console.log(`oprion = ${message.option} showMessage = ${showMessage}  contador = ${contador}`)
                const subFlowsMessage = showMessage
                    ? (contador === 0 ? `0) Volver al Menú` : `0) Volver al Anterior`)
                    : null;

                if (subFlowsMessage) {
                    await flowDynamic(subFlowsMessage);
                }

                return;
            }
        }

        if (flowCounter === (flowsData.length - 1)) {
            return gotoFlow(flujoFin);
        }
        updateCounters()
        return await gotoFlow(flowWelcome);

    })
    .addAction({ capture: true }, async (ctx, { flowDynamic, fallBack, gotoFlow, state }) => {
        let message = state.get('message');

        if (ctx.body.toString().toLowerCase() === 'chau' || ctx.body.toString().toLowerCase() === 'adios') {
            await flowDynamic("¡Gracias por comunicarte con @DanielBot! 😊")
            return gotoFlow(flujoFin);
        }
        if (message.isName) {
            await state.update({
                name: ctx.body.toString()
            });
        } else if (message.isNumber) {
            if (isNaN(ctx.body.trim())) {
                return await fallBack('Por favor, selecciona una opción válida.');
            }
        }
        // Captura la selección del usuario y navega al subflujo correspondiente
        if (message.option !== optionMesage.MENU || (message.childMessages.length === 0 && parseInt(ctx.body.trim()) !== 0)) {
            await state.update({ message: null, showMessage: false })
            messageList = []
            contador = 0
            return await gotoFlow(subFlujos);
        }
        const index = parseInt(ctx.body.trim()) - 1;
        if (!isNaN(index) && index >= 0 && index < message.childMessages.length) {
            messageList[contador] = message;
            contador++;
            await state.update({
                message: message.childMessages[index],
                showMessage: true
            });
            await gotoFlow(subFlujos);
        } else if (index === -1 && contador !== 0) {
            const previousMessage = messageList[(contador - 1)];
            await state.update({ message: previousMessage })
            contador--;
            if (contador === 0) {
                await state.update({ showMessage: false })
            }
            await gotoFlow(subFlujos);
        } else {
            // Si la selección no es válida, muestra un mensaje de error
            return await fallBack('Por favor, selecciona una opción válida.');
        }

    });
;


const flowWelcome = addKeyword(EVENTS.WELCOME)
    .addAction(async (_, { gotoFlow, state }) => {
        await state.update({
            message: flowsData[flowCounter].messages.length !== 0
                ? flowsData[flowCounter].messages[childCounter]
                : null
        });
        return await gotoFlow(subFlujos)

    })


// Función principal para iniciar el bot
const main = async () => {
    try {
        const adapterDB = new MockAdapter();
        const adapterFlow = createFlow([subFlujos, flowWelcome, flujoFin]);
        const adapterProvider = createProvider(BaileysProvider);

        // Crea el bot con los adaptadores y flujos definidos
        createBot({
            flow: adapterFlow,
            provider: adapterProvider,
            database: adapterDB,
        });

        // Muestra el código QR para conectar el bot
        QRPortalWeb();

    } catch (err) {
        console.error('Error obteniendo los flujos:', err);
    }

};

main();

