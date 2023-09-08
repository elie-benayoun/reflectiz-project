import { Pool, QueryArrayResult } from 'pg';

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host:  'postgres',
    port: parseInt(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DB,
});

const query = async (text, params):Promise<any[][]> => {
    const client = await pool.connect();
    try {
        const result:QueryArrayResult<any[]> = await client.query(text, params);
        return result.rows;
    } 
    catch (err) {
        console.log(err.stack);
        throw err;
    }
    finally {
        client.release();
    }

}

export default {
    query
}