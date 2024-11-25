const { addKeyword } = require('@bot-whatsapp/bot')

const flowPanchos = require('./Comida/Pancho')
const flowGaseosas = require('./Comida/Gaseosa');
const flowHaburguesas = require('./Comida/Hamburguesa');
const flowPizass = require('./Comida/Pizza');
//---------------------MENU CCOMIDA--------------------------------
const flowFoodMenu = addKeyword('1').addAnswer([
    " Seleccion una Opcion 😋",
    "1- Panchos 🌭",
    "2- Pizza 🍕",
    "3- Gaseosas 🍺",
    "4-Hamburguesas 🍔"
], { capture: true, delay: 2000 },
    async (ctx, { fallBack, flowDynamic, state }) => {
        const msg = parseInt(ctx.body.toLowerCase().trim());
        if (msg >= 1 && msg <= 4) {
            let foodSelection;
            switch (msg) {
                case 1:
                    foodSelection = 'Panchos';
                    break;
                case 2:
                    foodSelection = 'Pizza';
                    break;
                case 3:
                    foodSelection = 'Gaseosas';
                    break;
                case 4:
                    foodSelection = 'Hamburguesas';
                    break;
            }
            await state.update({ food: foodSelection });
            return;
        }
        await flowDynamic([
            { body: '❌ Opción no válida ❗❗, por favor Ingrese un Numero' }
        ]);

        return fallBack();
    },
    // Flujos de submenú
    [flowPanchos, flowGaseosas, flowHaburguesas, flowPizass])

module.exports = flowFoodMenu;