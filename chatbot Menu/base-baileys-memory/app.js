const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const flowMenu = require('./Flow/Menu/Menu');
//     .addAnswer("¡Genial!, Su pedido se esta armando porvor espere a que lo llamen")
// //-------------------------------Panhos-------------------------------------
// const flowPanchos = addKeyword("1", { sensitive: true })
//     .addAnswer("¡Genial!, Elija el tipo de panchos quiere llevar.")
//     .addAnswer(
//         [
//             'Seleccione una Opcion',
//             '1 - Completo',
//             '2 - Mexicana (Con papas fritas)',
//         ],
//         { capture: true },
//         async (ctx, { fallBack, flowDynamic, }) => {
//             const msg = parseInt(ctx.body.toLowerCase().trim());
//             if (msg == 1 || msg == 2) {
//                 return;
//             }
//             await flowDynamic([
//                 { body: 'Opción no válida, por favor seleccione una opción válida.' }
//             ]);
//             return fallBack();
//         },
//         flowResponse
//     )
// //-----------------------------------------------------
// //-------------------------------Hambuerguesas-------------------------------------
// const flowHaburguesas = addKeyword("4", { sensitive: true })
//     .addAnswer("¡Genial!, Elija el tipo de Hambuerguesas quiere llevar.")
//     .addAnswer(
//         [
//             'Seleccione una Opcion',
//             '1 - Mexicana',
//             '2 - Doble carne',
//             '3 - triple carne Combo max con Cajita Feliz',
//         ],
//         { capture: true },
//         async (ctx, { fallBack, flowDynamic, }) => {
//             const msg = parseInt(ctx.body.toLowerCase().trim());
//             if (msg == 1 || msg == 3) {
//                 return;
//             }
//             await flowDynamic([
//                 { body: 'Opción no válida, por favor seleccione una opción válida.' }
//             ]);
//             return fallBack();
//         },
//         flowResponse
//     )
// //-----------------------------------------------------
// //-------------------------------Pizzass-------------------------------------
// const flowPizass = addKeyword("2", { sensitive: true })
//     .addAnswer("¡Genial!, Elija el tipo de Pizzass quiere llevar.")
//     .addAnswer(
//         [
//             'Seleccione una Opcion',
//             '1 - Paleta con Queso',
//             '2 - Pepperoni',
//             '3 - Pizza Lomo con Queso',
//         ],
//         { capture: true },
//         async (ctx, { fallBack, flowDynamic, }) => {
//             const msg = parseInt(ctx.body.toLowerCase().trim());
//             if (msg == 1 || msg == 3) {
//                 return;
//             }
//             await flowDynamic([
//                 { body: 'Opción no válida, por favor seleccione una opción válida.' }
//             ]);
//             return fallBack();
//         },
//         flowResponse
//     )
// //-----------------------------------------------------
// //-------------------------------Gaseosas-------------------------------------
// const flowGaseosas = addKeyword("3", { sensitive: true })
//     .addAnswer("¡Genial!, Elija el tipo de Gaseosas quiere llevar.")
//     .addAnswer(
//         [
//             'Seleccione una Opcion',
//             '1 - Pepsi',
//             '2 - Coca Cola',
//             '3 - Fanta',
//             '4 - Sprite',
//         ],
//         { capture: true },
//         async (ctx, { fallBack, flowDynamic, }) => {
//             const msg = parseInt(ctx.body.toLowerCase().trim());
//             if (msg == 1 || msg == 4) {
//                 return;
//             }
//             await flowDynamic([
//                 { body: 'Opción no válida, por favor seleccione una opción válida.' }
//             ]);
//             return fallBack();
//         },
//         // Flujos de submenú
//         flowResponse
//     )
// //-----------------------------------------------------
// const flowMenu = addKeyword(EVENTS.WELCOME).addAnswer([
//     " Seleccion una Opcion",
//     "1- Panchos",
//     "2- Pizza",
//     "3- Gseosas",
//     "4-Hamburguesas"
// ], { capture: true, delay: 2000 },
//     async (ctx, { fallBack, flowDynamic }) => {
//         const msg = parseInt(ctx.body.toLowerCase().trim());
//         if (msg >= 1 && msg <= 4) {
//             return;
//         }
//         await flowDynamic([
//             { body: 'Opción no válida, por favor seleccione una opción válida.' }
//         ]);
//         return fallBack();
//     },
//     // Flujos de submenú
//     [flowPanchos, flowGaseosas, flowHaburguesas, flowPizass])
//-----------------------------------------------------


const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowMenu])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    QRPortalWeb()
}

main()
