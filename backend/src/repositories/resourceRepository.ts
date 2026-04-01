import sql from 'mssql';
import { getPool } from '../db';

export interface Resource {
    id?: number;
    resource_name: string;
    role: string;
    status: 'ACTIVE' | 'INACTIVE';
}

export const ResourceRepository = {
    getAll: async (): Promise<Resource[]> => {
        const pool = getPool();
        const result = await pool.request().query('SELECT * FROM Resources');
        return result.recordset;
    },

    create: async (resource: Resource): Promise<Resource> => {
        const pool = getPool();
        const result = await pool.request()
            .input('resource_name', sql.VarChar, resource.resource_name)
            .input('role', sql.VarChar, resource.role)
            .query(`
        INSERT INTO Resources (resource_name, role)
        OUTPUT INSERTED.*
        VALUES (@resource_name, @role)
      `);
        return result.recordset[0];
    },
};
