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


let flowWelcome = addKeyword(EVENTS.WELCOME);
let flowList = [];
let contador = 0;
let flowCounter = 0;
let childCounter = 0;
let select = false;

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
    .addAction(async (_, { endFlow }) => {
        flowCounter = 0
        select = false
        return await endFlow({ body: 'Fin de Flujos' });
    });

const subFlujos = addKeyword(EVENTS.ACTION)
    .addAction(async (_, { flowDynamic, state, gotoFlow }) => {
        //console.log("contador = " + contador)
        let mainM = state.get('mainMessage');
        let subFlowsMessage = `${mainM.body}`;

        if (contador === 0) {
            subFlowsMessage += `\n\n0) Volver al Menu`
        } else {
            subFlowsMessage += `\n\n0) Volver al Anterior`
        }
        await flowDynamic(subFlowsMessage);
        if (mainM.option === optionMesage.READ) {
            updateCounters();
            return await gotoFlow(flowWelcome);
        }

    })
    .addAction({ capture: true }, async (ctx, { fallBack, gotoFlow, state }) => {
        flowPrincipal = state.get('mainMessage');
        if (flowPrincipal.childMessages.length === 0 || flowPrincipal.option !== optionMesage.MENU) {
            updateCounters();
            console.log("Mere fui")
            return await gotoFlow(flowWelcome);
        }
        // Captura la selección del usuario y navega al subflujo correspondiente
        const index = parseInt(ctx.body.trim()) - 1;
        if (!isNaN(index) && index >= 0 && index < flowPrincipal.childMessages.length) {
            flowList[contador] = flowPrincipal;
            contador++;
            console.log(JSON.stringify(flowPrincipal.childMessages[index], null, 2))
            await state.update({ mainMessage: flowPrincipal.childMessages[index] })
            await gotoFlow(subFlujos);
        } else if (index === -1 && contador !== 0) {
            const flowAnterior = flowList[(contador - 1)];
            await state.update({ mainMessage: flowAnterior })
            contador--;
            await gotoFlow(subFlujos);
        } else if (index === -1 && contador === 0) {
            //Vuelve al Menu
            await gotoFlow(flowWelcome);
        }
        else {
            // Si la selección no es válida, muestra un mensaje de error
            await fallBack('Por favor, selecciona una opción válida.');
        }

    });
;


const generateFlow = (flowList) => {
    flowWelcome = flowWelcome
        .addAction(async (_, { flowDynamic, gotoFlow }) => {
            console.log("flowCounter= " + flowCounter)
            console.log("childCounter= " + childCounter)
            if (flowCounter === (flowsData.length)) {
                console.log("Me voy a flujoFin")
                return gotoFlow(flujoFin);
            }
            // let mainM = state.get('mainMessage');
            // if (mainM !== null && mainM !== undefined) {
            //     subFlowsMessage += `${mainM.body}`
            //}
            console.log("flowsData.name = " + flowsData[flowCounter].name)
            let subFlowsMessage = `Flujo: ${flowList[flowCounter].name}\n`;
            if (flowList[flowCounter].messages.length !== 0) {
                subFlowsMessage += flowList[flowCounter].messages[childCounter].body
                select = flowList[flowCounter].messages[childCounter].option !== optionMesage.READ ? true : false;
            }
            await flowDynamic(subFlowsMessage);
            if (!select) {
                updateCounters();
                return await gotoFlow(flowWelcome);
            }
        })
        .addAction({ capture: true }, async (ctx, { fallBack, state, gotoFlow }) => {
            const mainMessage = flowList[flowCounter].messages[childCounter];

            const updateAndNavigate = async (message) => {
                await state.update({ mainMessage: message });
                return await gotoFlow(subFlujos);
            };

            // Verifica si la opción es "CAPTURE" y navega
            if (mainMessage.option === optionMesage.CAPTURE) {
                console.log("Es capture");
                updateCounters();
                return await gotoFlow(flowWelcome);
            }

            // Valida la selección del usuario
            const index = parseInt(ctx.body.trim()) - 1;
            if (!isNaN(index) && index >= 0 && index < mainMessage.childMessages.length) {
                console.log("tiene hijos");
                return await updateAndNavigate(mainMessage.childMessages[index]);
            }

            // Si la selección no es válida, muestra un mensaje de error
            await fallBack('Por favor, selecciona una opción válida.');
        })

    return flowWelcome;
};

// Función principal para iniciar el bot
const main = async () => {
    try {
        generateFlow(flowsData); // Utilizando Json
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
