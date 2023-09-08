import postgresService from "./postgres.service";

/**
 * Save a new record in the api_request_history table
 * @param method The request method
 * @param path The request path
 * @param query The request queries as an object
 * @param body The request body as an object
 * @param origin The request orgin
 */
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