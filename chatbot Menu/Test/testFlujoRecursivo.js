/* Este código sirve para recibir un JSON de un Flujo con sus hijos(subMenu flujos) y verificar si tienen hijos para descomponerlos 
y mostrarlos dependiendo de la opción del usuario. Utiliza recursividad para navegar por los subflujos 
y vuelve al flujo inicial cuando se completan todos los subflujos. */

// Importa las bibliotecas necesarias para crear el bot de WhatsApp
const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot');
const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');
const { getFlows, connection } = require('./testBD'); // Conexion a BD y metodo para traer array de Flujos


//const Flow = require('../Entity/flow');
//const flowsData = require('../Json/flow.json');
// Convierte el JSON de flujos en una estructura de objetos
//const rootFlow = Flow.fromJSON(flowsData);

let flowWelcome = addKeyword(EVENTS.WELCOME);

// Define un flujo final que se ejecuta cuando no hay más subflujos
const flujoFin = addKeyword(EVENTS.ACTION)
    .addAction(async (_, { flowDynamic }) => {
        await flowDynamic([{ body: `FIN DE FlUJOS` }]);
        return;
    });


const subFlujos = addKeyword(EVENTS.ACTION)
    .addAction(async (_, { flowDynamic, state, gotoFlow }) => {
        flowPrincipal = state.get('flowPrincipal');
        if (flowPrincipal.flows.length !== 0) {
            let subFlowsMessage = `${flowPrincipal.name}\n\n`;
            // Construye el mensaje con los nombres de los subflujos
            flowPrincipal.flows.forEach((subFlow, subIndex) => {
                subFlowsMessage += `${subIndex + 1}) ${subFlow.name}\n`;
            });
            subFlowsMessage += `\n\n0) Volver al Menu`
            return await flowDynamic(subFlowsMessage);
        }
        await flowDynamic(flowPrincipal.name);
        return await gotoFlow(flujoFin);
    })
    .addAction({ capture: true }, async (ctx, { fallBack, gotoFlow, state }) => {
        flowPrincipal = state.get('flowPrincipal');
        // Captura la selección del usuario y navega al subflujo correspondiente
        const index = parseInt(ctx.body.trim()) - 1;
        if (!isNaN(index) && index >= 0 && index < flowPrincipal.flows.length) {
            await state.update({ flowPrincipal: flowPrincipal.flows[index], anterior: flowPrincipal })
            await gotoFlow(subFlujos);
        } else if (index === -1) {
            //Vuelve al Menu
            await gotoFlow(flowWelcome);
        }
        else {
            // Si la selección no es válida, muestra un mensaje de error
            await fallBack('Por favor, selecciona una opción válida.');
        }
    });
;

// Función recursiva que genera flujos dinámicamente
const generateMenu = (flowList) => {
    flowWelcome = flowWelcome
        .addAction(async (_, { flowDynamic }) => {
            if (flowList.length !== 0) {
                let subFlowsMessage = `MENU\n\n`;
                // Construye el mensaje con los nombres de los subflujos
                flowList.forEach((subFlow, subIndex) => {
                    subFlowsMessage += `${subIndex + 1}) ${subFlow.name}\n`;
                });
                return await flowDynamic(subFlowsMessage);
            }
            return await flowDynamic('Fin de Flujos Padres');
        })
        .addAction({ capture: true }, async (ctx, { fallBack, state, gotoFlow }) => {
            // Captura la selección del usuario y navega al subflujo correspondiente
            const index = parseInt(ctx.body.trim()) - 1;
            if (!isNaN(index) && index >= 0 && index < flowList.length) {
                await state.update({ flowPrincipal: flowList[index] })
                return await gotoFlow(subFlujos);
            } else {
                // Si la selección no es válida, muestra un mensaje de error
                await fallBack('Por favor, selecciona una opción válida.');
            }
        })
    return flowWelcome;
};

// Función principal para iniciar el bot
const main = async () => {
    try {
        // Recibir FLOW desde Base de Datos
        let flows = await getFlows();
        //let flowPrincipal = flows.map(flow => Flow.fromJSON(flow));
        //await Menu(flows);
        await generateMenu(flows);

        //await generateFlows(rootFlow); // Utilizando Json
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
    } finally {
        connection.end();
    }

};

main();


