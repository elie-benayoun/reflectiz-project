import postgresService from "./postgres.service";

const addApiRequestHistory = async (method, path, query, body, origin):Promise<void> => {
    let queryString = `
    INSERT INTO api_request_history 
    (method, path, query, body, origin, run_at) 
    VALUES ($1, $2, $3, $4, $5, $6)`;

    let params = [method, path, query, body, origin, new Date()];

    await postgresService.query(queryString, params);
}

export default {
    addApiRequestHistory
}