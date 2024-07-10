/* Este código sirve para recibir un JSON de un Flujo con sus hijos(subMenu flujos) y verificar si tienen hijos para descomponerlos 
y mostrarlos dependiendo de la opción del usuario. Utiliza recursividad para navegar por los subflujos 
y vuelve al flujo inicial cuando se completan todos los subflujos. */

// Importa las bibliotecas necesarias para crear el bot de WhatsApp
const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot');
const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');

const Flow = require('../Entity/flow');
const flowsData = require('../Json/flow.json');

// Convierte el JSON de flujos en una estructura de objetos
const rootFlow = Flow.fromJSON(flowsData);
let flowPrincipal = rootFlow;
let flowWelcome = addKeyword(EVENTS.WELCOME);

// Define un flujo final que se ejecuta cuando no hay más subflujos
const flujoFin = addKeyword(EVENTS.ACTION)
    .addAction(async (_, { flowDynamic }) => {
        // Restablece el flujo principal al flujo raíz
        flowPrincipal = rootFlow;
        await flowDynamic([{ body: `FIN DE SUBFLUJOS\n ADIOS` }]);
        return;
    });

// Función recursiva que genera flujos dinámicamente
const generateFlows = () => {
    flowWelcome = flowWelcome
        .addAction(async (_, { flowDynamic, gotoFlow }) => {
            if (flowPrincipal.flows.length !== 0) {
                let subFlowsMessage = `${flowPrincipal.name}\n\n`;
                // Construye el mensaje con los nombres de los subflujos
                flowPrincipal.flows.forEach((subFlow, subIndex) => {
                    subFlowsMessage += `${subIndex + 1}) ${subFlow.name}\n`;
                });
                return await flowDynamic(subFlowsMessage);
            }
            // Si no hay más subflujos, muestra el nombre del flujo principal y pasa al flujo final
            await flowDynamic(flowPrincipal.name);
            await gotoFlow(flujoFin);
        })
        .addAction({ capture: true }, async (ctx, { fallBack, gotoFlow }) => {
            // Captura la selección del usuario y navega al subflujo correspondiente
            const index = parseInt(ctx.body.trim()) - 1;
            if (!isNaN(index) && index >= 0 && index < flowPrincipal.flows.length) {
                const selectedFlow = flowPrincipal.flows[index];
                flowPrincipal = selectedFlow;
                await gotoFlow(flowWelcome);
            } else {
                // Si la selección no es válida, muestra un mensaje de error
                await fallBack('Por favor, selecciona una opción válida.');
            }
        });
    return flowWelcome;
};

// Función principal para iniciar el bot
const main = async () => {
    await generateFlows();
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([flowWelcome, flujoFin]);
    const adapterProvider = createProvider(BaileysProvider);

    // Crea el bot con los adaptadores y flujos definidos
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    // Muestra el código QR para conectar el bot
    QRPortalWeb();
};

main();


