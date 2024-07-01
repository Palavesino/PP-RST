const { addKeyword } = require('@bot-whatsapp/bot')
const { Gaseosa } = require('../../../Enum/Comida');
const flowResponse = require('./ArmadoPedido');

const flowGaseosas = addKeyword("3", { sensitive: true })
    .addAnswer("¡Genial!, Elija el tipo de Gaseosas quiere llevar.")
    .addAnswer(
        [
            'Seleccione una Opcion 🥤✩',
            `1 - ${Gaseosa.PEPSI.denomination} 🔵`,
            `2 - ${Gaseosa.COCA_COLA.denomination} 🔴`,
            `3 - ${Gaseosa.FANTA.denomination} 🟠`,
            `4 - ${Gaseosa.SPRITE.denomination} 🟢`,
        ],
        { capture: true, delay: 2000 },
        async (ctx, { fallBack, flowDynamic, state }) => {
            const msg = parseInt(ctx.body.toLowerCase().trim());
            if (msg >= 1 && msg <= 4) {
                switch (msg) {
                    case 1:
                        await state.update({
                            type: Gaseosa.PEPSI.denomination
                            , price: Gaseosa.PEPSI.price
                            , img: Gaseosa.PEPSI.img
                        })
                        break;
                    case 2:
                        await state.update({
                            type: Gaseosa.COCA_COLA.denomination
                            , price: Gaseosa.COCA_COLA.price
                            , img: Gaseosa.COCA_COLA.img
                        })
                        break;
                    case 3:
                        await state.update({
                            type: Gaseosa.FANTA.denomination
                            , price: Gaseosa.FANTA.price
                            , img: Gaseosa.FANTA.img
                        })
                        break;
                    case 4:
                        await state.update({
                            type: Gaseosa.SPRITE.denomination
                            , price: Gaseosa.SPRITE.price
                            , img: Gaseosa.SPRITE.img
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

module.exports = flowGaseosas;