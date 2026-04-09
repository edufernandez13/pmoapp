import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_SERVER || '',
    database: process.env.SQL_DATABASE,
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

async function fix() {
    try {
        const pool = await sql.connect(config);
        console.log('Connected.');
        await pool.request().query('ALTER TABLE MonthlyClosures DROP CONSTRAINT UQ_ProjectPeriod;');
        console.log('Dropped UQ_ProjectPeriod');
        await pool.request().query('ALTER TABLE MonthlyClosures ADD CONSTRAINT UQ_ProjectPeriodStatus UNIQUE (project_id, period, status);');
        console.log('Added UQ_ProjectPeriodStatus');
        process.exit(0);
    } catch(e) {
        console.error('Error:', e);
        process.exit(1);
    }
}
fix();
