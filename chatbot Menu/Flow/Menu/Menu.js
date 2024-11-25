const { addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const flowFoodMenu = require('./FoodMenu')
const flowUserMenu = require('./UserMenu');

//---------------------MENU--------------------------------
/*
┌──────── -ˋˏ ∵✉︎∴ ˎˊ- ────────┐
-ˏˋ⋆ᴡ ᴇ ʟ ᴄ ᴏ ᴍ ᴇ  𝑻𝒐  𝑪𝒉𝒂𝒕𝑩𝒐𝒕⋆ˊˎ-
└──────── -ˋˏ ∵✉︎∴ ˎˊ- ────────┘
*/
const flowMenu = addKeyword(EVENTS.WELCOME)
    .addAnswer('ᴡ ᴇ ʟ ᴄ ᴏ ᴍ ᴇ  𝓣𝓸  𝓒𝓱𝓪𝓽𝓑𝓸𝓽')
    .addAnswer([
        " Seleccion una Opcion",
        "1- Comida 🍜 ",
        "2- Usuario 👤",
    ], { capture: true, delay: 2000 },
        async (ctx, { fallBack, flowDynamic }) => {
            const msg = parseInt(ctx.body.toLowerCase().trim());
            if (msg >= 1 && msg <= 2) {
                return;
            }
            await flowDynamic([
                { body: '❌ Opción no válida ❗❗, por favor Ingrese un Numero' }
            ]);

            return fallBack();
        },
        // Flujos de submenú
        [flowFoodMenu, flowUserMenu])

module.exports = flowMenu;