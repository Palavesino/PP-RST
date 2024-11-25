const { addKeyword, EVENTS } = require('@bot-whatsapp/bot')

// const flowFactura = addKeyword(EVENTS.ACTION)
//     .addAnswer('hola', null, async (ctx, { flowDynamic }) => {
//         await flowDynamic([
//             { body: 'ESAAAAAAAAA ' }
//         ]);
//     })
//     .addAnswer("¡Genial!, Su pedido se esta armando porvor espere a que lo llamen")




// const flowResponse = addKeyword(['1', '2', '3', '4'], { delay: 2000 })
//     .addAnswer('Ingresa Cantidad (numero)')
//     .addAction({ capture: true }, async (ctx, { fallBack, flowDynamic, state, gotoFlow }) => {
//         await state.update({ amount: ctx.body })
//         const msg = parseInt(ctx.body.toLowerCase().trim());
//         if (isNaN(msg)) {
//             await flowDynamic([
//                 { body: 'Opción no válida, por favor Ingrese un Numero' }
//             ]);
//             return fallBack();
//         }
//         // Enviamos al usuario al flujo principal
//         return gotoFlow(flowFactura)
//     });

const flowResponse = addKeyword(['1', '2', '3', '4'], { delay: 2000 })
    .addAnswer("¡Genial!, Su pedido se esta armando porvor espere a que lo llamen")
    .addAction(async (ctx, { flowDynamic, state }) => {
        const type = state.get('type')
        const food = state.get('food')
        const price = state.get('price')
        await flowDynamic([
            {
                body: `▄︻デ══━一💥FACTURA 
                    \nComida = ${food} 🤩
                    \nTipo = ${type}  ⭐️
                    \nTotal = $${price} 🤑 `
            }
        ]);
    })



module.exports = flowResponse;