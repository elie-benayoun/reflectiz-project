import { Pool } from 'pg';

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host:  'postgres',
    port: parseInt(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DB,
});

const query = async (text, params):Promise<any[]> => {
    console.log('query');
    console.log('query', text, params);
    console.log(process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, process.env.POSTGRES_PORT, process.env.POSTGRES_DB)
    const client = await pool.connect();
    console.log('Got Client');
    try {
        const result = await client.query(text, params);
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