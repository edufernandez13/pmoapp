require('dotenv').config();
const sql = require('mssql');

const dbConfig = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
    server: process.env.SQL_SERVER,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

async function clearDatabase() {
    console.log('⚠️ INICIANDO LIMPIEZA DE BASE DE DATOS ⚠️');
    console.log('Se eliminarán todos los registros de todas las tablas...');
    
    try {
        let pool = await sql.connect(dbConfig);
        console.log('✅ Conexión establecida.');

        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            const request = new sql.Request(transaction);

            console.log('🗑️ Eliminando horas de recursos por cierre (ClosureResourceHours)...');
            await request.query('DELETE FROM ClosureResourceHours');

            console.log('🗑️ Eliminando cierres mensuales (MonthlyClosures)...');
            await request.query('DELETE FROM MonthlyClosures');

            console.log('🗑️ Eliminando tarifas mensuales de profesionales (ResourceMonthlyRates)...');
            await request.query('DELETE FROM ResourceMonthlyRates');

            console.log('🗑️ Eliminando profesionales (Resources)...');
            await request.query('DELETE FROM Resources');

            console.log('🗑️ Eliminando proyectos (Projects)...');
            await request.query('DELETE FROM Projects');

            await transaction.commit();
            console.log('✅ Base de datos limpiada con éxito.');

        } catch (err) {
            console.error('❌ Error durante el borrado. Revirtiendo transacción (Rollback)...');
            await transaction.rollback();
            throw err;
        }

    } catch (err) {
        console.error('❌ Error general:', err);
    } finally {
        await sql.close();
        console.log('👋 Conexión cerrada.');
    }
}

clearDatabase();
