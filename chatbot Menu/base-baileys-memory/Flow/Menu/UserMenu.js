const { addKeyword } = require('@bot-whatsapp/bot')
//---------------------MENU USUARIO --------------------------------
const flowUserMenu = addKeyword('2').addAnswer([
    " Ingrese Un id de Usuario 🗝️",
], { capture: true, delay: 2000 },
    async (ctx, { fallBack, flowDynamic }) => {
        const msg = parseInt(ctx.body.toLowerCase().trim());
        if (isNaN(msg)) {
            await flowDynamic([
                { body: '❌ Opción no válida ❗❗, por favor Ingrese un Numero' }
            ]);
            return fallBack();
        }
        let user;
        await fetch(`https://jsonplaceholder.typicode.com/todos/${msg}`)
            .then(response => response.json())
            .then(json =>
                user = json
            );
        await flowDynamic([
            { body: (JSON.stringify(user, null, 2)) }
        ]);

    },
)
module.exports = flowUserMenu;