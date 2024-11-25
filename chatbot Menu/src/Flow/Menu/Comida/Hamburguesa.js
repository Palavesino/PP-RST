const { addKeyword } = require('@bot-whatsapp/bot')
const flowResponse = require('./ArmadoPedido');
const { Hambuerguesas } = require('../../../Enum/Comida');
//-------------------------------Hambuerguesas-------------------------------------
const flowHaburguesas = addKeyword("4", { sensitive: true })
    .addAnswer("¡Genial!, Elija el tipo de Hambuerguesas quiere llevar.")
    .addAnswer(
        [
            'Seleccione una Opcion',
            `1 - ${Hambuerguesas.MEXICANA.denomination} 🟢`,
            `2 - ${Hambuerguesas.DOBLE_CARNE.denomination} 🟡`,
            `3 - ${Hambuerguesas.TRIPLE_CARNE_COMBO_MAX.denomination} 🔴`,

        ],
        { capture: true, delay: 2000 },
        async (ctx, { fallBack, flowDynamic,state }) => {
            const msg = parseInt(ctx.body.toLowerCase().trim());
            if (msg >= 1 && msg <= 3) {
                switch (msg) {
                    case 1:
                        await state.update({
                            type: Hambuerguesas.MEXICANA.denomination
                            , price: Hambuerguesas.MEXICANA.price
                            , img: Hambuerguesas.MEXICANA.img
                        })
                        break;
                    case 2:
                        await state.update({
                            type: Hambuerguesas.DOBLE_CARNE.denomination
                            , price: Hambuerguesas.DOBLE_CARNE.price
                            , img: Hambuerguesas.DOBLE_CARNE.img
                        })
                        break;
                    case 3:
                        await state.update({
                            type: Hambuerguesas.TRIPLE_CARNE_COMBO_MAX.denomination
                            , price: Hambuerguesas.TRIPLE_CARNE_COMBO_MAX.price
                            , img: Hambuerguesas.TRIPLE_CARNE_COMBO_MAX.img
                        })
                        break;
                }
                return;
            }
            await flowDynamic([
                { body: '❌ Opción no válida ❗❗, por favor Ingrese un Numero' }
            ]);
            return fallBack();
        },
        flowResponse
    )

module.exports = flowHaburguesas;