
const mysql = require('mysql2');

// Crear una conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'rst'
});

// Conectar a la base de datos
connection.connect(err => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conexión a la base de datos exitosa');
});

// Función para obtener flujos recursivamente
const getFlows = async (parentId = null) => {
    return new Promise((resolve, reject) => {
        const query = parentId === null
            ? 'SELECT * FROM flow WHERE parent_id IS NULL'
            : 'SELECT * FROM flow WHERE parent_id = ?';

        connection.query(query, [parentId], (err, results) => {
            if (err) {
                return reject(err);
            }

            const flows = results.map(flow => ({
                id: flow.id,
                name: flow.name,
                description: flow.description,
                parent_id: flow.parent_id,
                flows: []
            }));

            Promise.all(flows.map(async flow => {
                flow.flows = await getFlows(flow.id);
                return flow;
            })).then(resolve).catch(reject);
        });
    });
};

// Obtener los flujos y mostrarlos
// getFlows().then(flows => {
//     console.log(JSON.stringify(flows, null, 2));
//     connection.end();
// }).catch(err => {
//     console.error('Error obteniendo los flujos:', err);
//     connection.end();
// });

module.exports = {
    getFlows,
    connection
  };

