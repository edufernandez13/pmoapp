import { connectDB } from './db/index';

const patchDatabase = async () => {
    try {
        console.log('Connecting to database...');
        const pool = await connectDB();

        console.log('Running ALTER TABLE commands...');

        // 1. Ampliar columnas en la tabla de Tarifas Mensuales
        await pool.request().query(`
            ALTER TABLE ResourceMonthlyRates ALTER COLUMN direct_rate DECIMAL(15, 2) NOT NULL;
            ALTER TABLE ResourceMonthlyRates ALTER COLUMN indirect_rate DECIMAL(15, 2) NOT NULL;
        `);
        console.log('ResourceMonthlyRates updated successfully.');

        // 2. Ampliar columnas en la tabla del historial de los cierres
        await pool.request().query(`
            ALTER TABLE ClosureResourceHours ALTER COLUMN rate_snapshot_direct DECIMAL(15, 2) NOT NULL;
            ALTER TABLE ClosureResourceHours ALTER COLUMN rate_snapshot_indirect DECIMAL(15, 2) NOT NULL;
        `);
        console.log('ClosureResourceHours updated successfully.');

        console.log('Database patching complete.');
        process.exit(0);

    } catch (err) {
        console.error('Error patching database:', err);
        process.exit(1);
    }
};

patchDatabase();
