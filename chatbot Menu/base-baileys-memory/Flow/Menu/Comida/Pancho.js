const { addKeyword } = require('@bot-whatsapp/bot')
const flowResponse = require('./ArmadoPedido');
const {Pancho} = require('../../../Enum/Comida');
//-------------------------------Panchos-------------------------------------
const flowPanchos = addKeyword("1", { sensitive: true })
    .addAnswer("¡Genial!, Elija el tipo de panchos quiere llevar.")
    .addAnswer(
        [
            'Seleccione una Opcion',
            `1 - ${Pancho.COMPLETO.denomination} 🟢`,
            `2 - ${Pancho.MEXICANA.denomination} 🟡`,
        ],
        { capture: true, delay: 2000 },
        async (ctx, { fallBack, flowDynamic, state }) => {
            const msg = parseInt(ctx.body.toLowerCase().trim());
            if (msg >= 1 && msg <= 2) {
                switch (msg) {
                    case 1:
                        await state.update({
                            type: Pancho.COMPLETO.denomination
                            , price: Pancho.COMPLETO.price
                            , img: Pancho.COMPLETO.img
                        })
                        break;
                    case 2:
                        await state.update({
                            type: Pancho.MEXICANA.denomination
                            , price: Pancho.MEXICANA.price
                            , img: Pancho.MEXICANA.img
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

module.exports = flowPanchos;