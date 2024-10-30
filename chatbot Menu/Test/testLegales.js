const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')


/* SIMULACIÓN DE CONSUMO DE API */
//Trae la parte de final de cada mensaje
const finMensaje = "0 - Para volver al menú\nChau - Para terminar la conversación 😊";
//Trae los mensajes dependiendo de los flujos
async function mens(flujo, mensaje) {
    try {
        const response = {
            0: {
                1: "Hola! Te has comunicado con el bot de @deportiva.mza NUEVO",
                2: "🤖 Por favor, selecciona una opción: \n\n1- Legales 📝\n2- Escribanía 📃\n3- Preguntas frecuentes ℹ️\n4- Hablar con un representante☎️\n\n_Para terminar la conversación escribe chau 😊_",
                3: "Datos de Usuario 👤\n\nIngrese nombre y apellido",
                4: "Disponibilidad Horaria 🕒\n\nSelecciona una opción:\n1- 8:00 a 12:00\n2- 12:00 a 16:00\n3- 16:00 a 20:00",
            },
            1: {
                1: "🤖 Por favor, selecciona una opción: \n\n1- Laboral 👷🏾‍♂️\n2- Penal 🧑🏻‍⚖️\n3- Derecho de familia 👨‍👩‍👧"
            },
            2: {
                1: "🤖 Por favor, selecciona una opción: \n\n1- Escritura de compra venta 📝\n2- Poderes 🏛️\n3- Actas 📋\n4- Certificado de firma y documentación 🗂️\n5- Confeccion de contratos de locación 📄\n6- Actas de notificación y constatación 🤝",
                2: "Actas de notificación y constatación 🤝", // submenu de Actas
            },
            3: {
                1: "*Preguntas frecuentes*\n1-De donde son las calzas?\n2-Qué talles abarcan S, M, L?"
            },
            4: {
                1: "Aguarde un momento, en breve se comunicará uno de nuestros representantes...\nPara terminar la conversación con el representante escribe 'chau'"
            },
            5: {
                1: "Opción 1",
                2: "Opción 2"
            },
            100: {
                1: "Gracias por comunicarte con @deportiva.mza\nRecuerda consultar nuestras redes para no perderte ninguna novedad!"
            },
        };
        return response[parseInt(flujo)][parseInt(mensaje)];
    } catch (err) {
        console.log("ERROR MENU:", err);
        return err;
    }
}
/* ADIÓS Final del Programa*/
async function finalFlow(flowDynamic, gotoFlow, endFlow, message, fallBack) {
    //Trae el mensaje y lo pasa a minusculas
    const msg = message.body.toString().toLowerCase();
    if (msg === "chau" || msg === "adios") {
        // Saludo final
        const saludoFinal = await mens(100, 1);
        await flowDynamic(saludoFinal);
        return endFlow();
    } else if (msg === "0" && gotoFlow !== null) {
        return gotoFlow(flowMenu)
    } else if (fallBack !== null) {
        await flowDynamic([
            { body: 'Opción no válida, por favor seleccione una opción válida.' }
        ]);
        return fallBack()
    }
}

//---------------- SubFlujo Hijo del 3 -------------------------
/*
const subFlow_1_de_flowTres = addKeyword('1')
    .addAnswer('Opcion 1', { capture: true },
        async (ctx, { flowDynamic, gotoFlow, endFlow, fallBack }) => {
            try {
                await finalFlow(flowDynamic, gotoFlow, endFlow, ctx, fallBack);
            } catch (error) {
                // Retorna el error por el body y por consola.
                console.log("Error en el subFlow_1_de_flowTres", error);
                await flowDynamic([{ body: "Ocurrio un error, por favor intentalo de nuevo" }]);
                return fallBack();
            }
        }
    )
const subFlow_2_de_flowTres = addKeyword('2')
    .addAnswer('Opcion 2', { capture: true },
        async (ctx, { flowDynamic, gotoFlow, endFlow, fallBack }) => {
            try {
                await finalFlow(flowDynamic, gotoFlow, endFlow, ctx, fallBack);
            } catch (error) {
                // Retorna el error por el body y por consola.
                console.log("Error en el subFlow_2_de_flowTres", error);
                await flowDynamic([{ body: "Ocurrio un error, por favor intentalo de nuevo" }]);
                return fallBack();
            }
        }
    )
*/
//--------------------------------------------------------------------------
//FLUJOS
const flowCuatro = addKeyword('4')
    .addAction(null,
        async (_, { flowDynamic }) => {
            const response = await mens(4, 1);
            await flowDynamic(response)
        })
    .addAction(
        { capture: true, delay: 700 },
        // Handler de la respuesta
        async (ctx, { fallBack, flowDynamic, gotoFlow, endFlow, state }) => {
            try {
                await finalFlow(flowDynamic, gotoFlow, endFlow, ctx, fallBack);
            } catch (error) {
                // Retorna el error por el body y por consola.
                console.log("Error en el FlowDos", error);
                await flowDynamic([{ body: "Ocurrio un error, por favor intentalo de nuevo" }]);
                return fallBack();
            }
        }
    )

const flowTres = addKeyword('3')
    .addAction(null,
        async (_, { flowDynamic }) => {
            console.log("Entre magicamente")
            const response = await mens(3, 1);
            await flowDynamic(response)
        })
    .addAnswer(
        finMensaje,
        { capture: true, delay: 700 },
        // Handler de la respuesta
        async (ctx, { fallBack, flowDynamic, gotoFlow, endFlow }) => {
            try {

                await finalFlow(flowDynamic, gotoFlow, endFlow, ctx, null);


                const msg = parseInt(ctx.body.toLowerCase().trim());
                if (msg >= 1 && msg <= 2) {
                    return;
                }
                //--------------SUBFLUJOS--------------
                // Convertimos el mensaje en un número
                console.log("Flujo menu", msg)
                /**
                 Si cumple esta condicion se finalizaria el flujo 
                 por ende seria mejor crear sub Flujo hijos para seguir
                 el menu
                 */
                if (msg === 1 || msg === 2) {
                    var response = await mens(5, msg);
                    await flowDynamic(response);
                    return;
                }
                await flowDynamic([
                    { body: 'Opción no válida, por favor seleccione una opción válida.' }
                ]);
                return fallBack();
                // return gotoFlow(flowTres);
            } catch (error) {

                // Retorna el error por el body y por consola.
                console.log("Error en el FlowTres", error);
                await flowDynamic([{ body: "Ocurrio un error, por favor intentalo de nuevo" }]);
                return fallBack();
            }
        },
    )

const flowDos = addKeyword('2')
    .addAction(null,
        async (_, { flowDynamic }) => {
            const response = await mens(2, 1);
            await flowDynamic(response)
        })
    .addAnswer(
        finMensaje,
        { capture: true, delay: 700 },
        // Handler de la respuesta
        async (ctx, { fallBack, flowDynamic, gotoFlow, endFlow, state }) => {
            try {
                await finalFlow(flowDynamic, gotoFlow, endFlow, ctx, null);
                const msg = parseInt(ctx.body.toLowerCase().trim());
                // Si el número es válido, lo pasamos al flujo correspondiente
                if (msg >= 1 && msg <= 5) {
                    await state.update({ optionSubMenu: msg })
                    return gotoFlow(flowUserData);
                }
                await flowDynamic([
                    { body: 'Opción no válida, por favor seleccione una opción válida.' }
                ]);
                return fallBack();
            } catch (error) {

                // Retorna el error por el body y por consola.
                console.log("Error en el FlowDos", error);
                await flowDynamic([{ body: "Ocurrio un error, por favor intentalo de nuevo" }]);
                return fallBack();
            }
        },
        // Flujos de submenú
        []
    )

const flowUno = addKeyword('1')
    .addAction(null,
        async (_, { flowDynamic }) => {
            const response = await mens(1, 1);
            await flowDynamic(response)
        })
    .addAnswer(
        finMensaje,
        { capture: true, delay: 700 },
        // Handler de la respuesta
        async (ctx, { fallBack, flowDynamic, gotoFlow, endFlow, state }) => {
            try {
                await finalFlow(flowDynamic, gotoFlow, endFlow, ctx, null);
                const msg = parseInt(ctx.body.toLowerCase().trim());
                // Si el número es válido, lo pasamos al flujo correspondiente
                if (msg >= 1 && msg <= 3) {
                    await state.update({ optionSubMenu: msg })
                    return gotoFlow(flowUserData);
                }
                await flowDynamic([
                    { body: 'Opción no válida, por favor seleccione una opción válida.' }
                ]);
                return fallBack();
            } catch (error) {

                // Retorna el error por el body y por consola.
                console.log("Error en el FlowUno", error);
                await flowDynamic([{ body: "Ocurrio un error, por favor intentalo de nuevo" }]);
                return fallBack();
            }
        },
        // Flujos de submenú
        []
    )
const flowUserData = addKeyword(EVENTS.ACTION)
    .addAction(null,
        async (_, { flowDynamic }) => {
            console.log("Entre a addaction de flowUserData ")
            const response = await mens(0, 3);
            await flowDynamic(response)
        })
    .addAction(
        { capture: true, delay: 700 },
        // Handler de la respuesta
        async (ctx, { fallBack, flowDynamic, gotoFlow, endFlow, state }) => {
            try {
                console.log("Emtre a flowUserData answer")
                await finalFlow(flowDynamic, null, endFlow, ctx, null);
                await state.update({ name: ctx.body })
                return gotoFlow(flowUserData2);
            } catch (error) {
                // Retorna el error por el body y por consola.
                console.log("Error en el flowUserData", error);
                await flowDynamic([{ body: "Ocurrio un error, por favor intentalo de nuevo" }]);
                return fallBack();
            }
        }
    )

const flowUserData2 = addKeyword(EVENTS.ACTION)
    .addAction(null,
        async (_, { flowDynamic }) => {
            const response = await mens(0, 4);
            await flowDynamic(response)
        })
    .addAction(
        { capture: true, delay: 700 },
        // Handler de la respuesta
        async (ctx, { fallBack, flowDynamic, gotoFlow, endFlow, state }) => {
            try {
                await finalFlow(flowDynamic, null, endFlow, ctx, null);
                const msg = parseInt(ctx.body.toLowerCase().trim());
                console.log("Flujo flowUserData2", msg)
                // Si el número es válido, lo pasamos al flujo correspondiente
                if (msg >= 1 && msg <= 3) {
                    await state.update({ time: msg })
                    return gotoFlow(flowUserData3);
                }

                // Si el número no es válido, mostramos un mensaje de error
                await flowDynamic([
                    { body: 'Opción no válida, por favor seleccione una opción válida.' }
                ]);
                return fallBack();
            } catch (error) {
                // Retorna el error por el body y por consola.
                console.log("Error en el flowUserData2", error);
                await flowDynamic([{ body: "Ocurrio un error, por favor intentalo de nuevo" }]);
                return fallBack();
            }
        }
    )

const flowUserData3 = addKeyword(EVENTS.ACTION)
    .addAction(null,
        async (_, { flowDynamic, state }) => {
            const myState = state.getMyState()
            await flowDynamic(`Datos Capturados son :\n\nNombre: ${myState.name}\n Opcion Menu: ${myState.optionMenu}\n Opcion subMenu:  ${myState.optionSubMenu}\n Opcion Horaria: ${myState.time}`)
        })
        .addAction({ delay: 700 },
            async (_, { flowDynamic }) => {
                await flowDynamic(finMensaje)  
            })
            .addAction( { capture: true},
                async (ctx, { fallBack, flowDynamic, gotoFlow, endFlow }) => {
                    try {
                        await finalFlow(flowDynamic, gotoFlow, endFlow, ctx, fallBack);
                    } catch (error) {
        
                        // Retorna el error por el body y por consola.
                        console.log("Error en el FlowDos", error);
                        await flowDynamic([{ body: "Ocurrio un error, por favor intentalo de nuevo" }]);
                        return fallBack();
                    }
                })
    // .addAnswer(
    //     finMensaje,
    //     {capture:true,delay:2000},
    //     // Handler de la respuesta
    //     async (ctx, { fallBack, flowDynamic, gotoFlow, endFlow }) => {
    //         try {
    //             await finalFlow(flowDynamic, gotoFlow, endFlow, ctx, fallBack);
    //         } catch (error) {

    //             // Retorna el error por el body y por consola.
    //             console.log("Error en el flowUserData3", error);
    //             await flowDynamic([{ body: "Ocurrio un error, por favor intentalo de nuevo" }]);
    //             return fallBack();
    //         }
    //     },
    //     // Flujos de submenú
    //     []
    // )
const flowMenu = addKeyword(EVENTS.ACTION)
    .addAction(null,
        async (_, { flowDynamic }) => {
            const response = await mens(0, 2);
            await flowDynamic(response)
        })
    .addAnswer('⚔️ 𝐌𝐄𝐍𝐔 ⚔️', { capture: true },
        // Handler de la respuesta
        async (ctx, { fallBack, flowDynamic, endFlow, gotoFlow, state }) => {
            try {
                await finalFlow(flowDynamic, null, endFlow,ctx, null);
                // Convertimos el mensaje en un número
                const msg = parseInt(ctx.body.toLowerCase().trim());
                console.log("Flujo menu", msg)
                // Si el número es válido, lo pasamos al flujo correspondiente
                if (msg >= 1 && msg <= 4) {
                    let aux = '';
                    if (msg === 1) {
                        aux = 'Legales'
                    } else if (msg === 2) {
                        aux = 'Escribanía '
                    }
                    if (aux !== '') {
                        await state.update({ optionMenu: aux })
                    }
                    return;
                }

                // Si el número no es válido, mostramos un mensaje de error
                await flowDynamic([
                    { body: 'Opción no válida, por favor seleccione una opción válida.' }
                ]);
                return gotoFlow(flowMenu);

            } catch (error) {

                // Retorna el error por el body y por consola.
                console.log("Error en el FlowMenú", error);
                await flowDynamic([{ body: "Ocurrio un error, por favor intentalo de nuevo" }]);
                return fallBack();
            }
        },
        // Flujos de submenú
        [flowUno, flowDos, flowTres, flowCuatro]
    )

// Flow bienvenida
const flowBienvenida = addKeyword(EVENTS.WELCOME)
    .addAction(
        null,
        async (ctx, { flowDynamic, gotoFlow, fallBack, state }) => {
            try {
                console.log("NUMERO DE TELEFONO DEL USUARIO")
                console.log(ctx.from) //NUMERO DE TELEFONO DEL USUARIO
                // Bienvenida desde base de datos
                const response = await mens(0, 1);
                // Mensaje de bienvenida por chat
                await flowDynamic(response)
                // Después de la presentación enviamos al flujo de saludo
                return gotoFlow(flowMenu)
            } catch (error) {
                console.log(error);
                await flowDynamic([{ body: "Ocurrió un error, por favor inténtalo de nuevo" }]);
                return fallBack();
            }
        })

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowBienvenida, flowMenu, flowUserData2, flowUserData, flowUserData3]) //[MEJORAR]Se supone que no se deberían poner acá los flows pero no funciona bien sino :/
    const adapterProvider = createProvider(BaileysProvider)
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    QRPortalWeb()
}

main()
