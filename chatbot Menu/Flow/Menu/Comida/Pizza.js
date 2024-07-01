const { addKeyword } = require('@bot-whatsapp/bot')
const flowResponse = require('./ArmadoPedido');
const { Pizza } = require('../../../Enum/Comida');

//-------------------------------Pizzass-------------------------------------
const flowPizass = addKeyword("2", { sensitive: true })
    .addAnswer("Seleccion tipo de Pizzas quiere llevar.")
    .addAnswer(
        [
            'Seleccione una Opcion',
            `1 - ${Pizza.PALETA_CON_QUESO.denomination} 🟢`,
            `2 - ${Pizza.PEPPERONI.denomination} 🟡`,
            `3 - ${Pizza.PIZZA_LOMO_CON_QUESO.denomination} 🔴`,
        ],
        { capture: true, delay: 2000 },
        async (ctx, { fallBack, flowDynamic, state }) => {
            const msg = parseInt(ctx.body.toLowerCase().trim());
            if (msg >= 1 && msg <= 3) {
                switch (msg) {
                    case 1:
                        await state.update({
                            type: Pizza.PALETA_CON_QUESO.denomination
                            , price: Pizza.PALETA_CON_QUESO.price
                            , img: Pizza.PALETA_CON_QUESO.img
                        })
                        break;
                    case 2:
                        await state.update({
                            type: Pizza.PEPPERONI.denomination
                            , price: Pizza.PEPPERONI.price
                            , img: Pizza.PEPPERONI.img
                        })
                        break;
                    case 3:
                        await state.update({
                            type: Pizza.PIZZA_LOMO_CON_QUESO.denomination
                            , price: Pizza.PIZZA_LOMO_CON_QUESO.price
                            , img: Pizza.PIZZA_LOMO_CON_QUESO.img
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

module.exports = flowPizass;