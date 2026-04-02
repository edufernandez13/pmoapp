import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config: sql.config = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_SERVER || 'localhost',
    database: process.env.SQL_DATABASE,
    options: {
        encrypt: true, // Use this if you're on Azure.
        trustServerCertificate: true, // Change to false for production
    },
    pool: {
        max: 10,
        min: 1, // Require at least 1 alive connection
        idleTimeoutMillis: 30000 // Prevent Azure from silently dropping half-open sockets
    }
};


let pool: sql.ConnectionPool | null = null;

export const connectDB = async () => {
    try {
        pool = await sql.connect(config);
        console.log('Connected to Azure SQL Database');
        return pool;
    } catch (err) {
        console.error('Database connection failed:', err);
        throw err;
    }
};

export const getPool = () => {
    if (!pool) {
        throw new Error('Database not connected');
    }
    return pool;
};
