require('dotenv').config();
const sql = require('mssql');

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    server: process.env.DB_SERVER,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: process.env.NODE_ENV === 'production' || true,
        trustServerCertificate: false
    }
};

async function verifyProfessionals() {
    try {
        console.log('🔗 Conectando a la base de datos SQL...');
        let pool = await sql.connect(dbConfig);
        console.log('✅ Conexión exitosa.');

        console.log('\n=======================================');
        console.log('📌 TABLA: Resources (Profesionales Activos)');
        console.log('=======================================');
        let resQuery = await pool.request().query('SELECT id, resource_name, role, status FROM Resources');
        if (resQuery.recordset.length === 0) {
            console.log('No hay recursos registrados.');
        } else {
            console.table(resQuery.recordset);
        }

        console.log('\n=======================================');
        console.log('📌 TABLA: ResourceMonthlyRates (Tarifas)');
        console.log('=======================================');
        let rateQuery = await pool.request().query(`
            SELECT 
                r.resource_name as 'Profesional', 
                FORMAT(mr.period, 'yyyy-MM') as 'Periodo', 
                mr.direct_rate as 'Tarifa Directa', 
                mr.indirect_rate as 'Tarifa Indirecta',
                (mr.direct_rate + mr.indirect_rate) as 'Break Even'
            FROM ResourceMonthlyRates mr
            JOIN Resources r ON mr.resource_id = r.id
            ORDER BY r.resource_name, mr.period
        `);
        
        if (rateQuery.recordset.length === 0) {
            console.log('No hay tarifas mensuales registradas.');
        } else {
            console.table(rateQuery.recordset);
        }

    } catch (err) {
        console.error('❌ Error de conexión o consulta:', err);
    } finally {
        await sql.close();
        console.log('\n👋 Conexión cerrada.');
    }
}

verifyProfessionals();
