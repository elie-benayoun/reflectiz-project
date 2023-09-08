import IDomain from "../models/domain.model";
import postgresService from "./postgres.service"

/**
 * Get the domain data for a single domain from the domains table
 * @param domain The domain to retrieve
 * @returns 
 */
const getSingleDomain =  async (domain:string): Promise<IDomain | null> => {
    let query = `
    SELECT 
        id, 
        domain, 
        last_analyzed 
    FROM domains 
    WHERE domain = $1 
    LIMIT 1
    `;
    let params = [domain];
    let queryResult = await postgresService.query(query, params);
    if (queryResult.length === 0) return null;
    return formateSingleDomain(queryResult[0]);
}

const formateSingleDomain = (postgressRow:{[key:string]:any}):IDomain => {
    return {
            domain: postgressRow['domain'],
            id: postgressRow['id'],
            last_analyzed: postgressRow["last_analyzed"],
            in_progress: postgressRow["in_progress"]
    }
}

/**
 * Add a specific domain to the domains table
 * @param domain domain to add to the domains table
 */
const addDomain = async (domain:string):Promise<void> => {
    let query = `INSERT INTO domains (domain, in_progress) VALUES ($1, $2)`;
    let params = [domain, false];
    await postgresService.query(query, params);
}


export default {
    getSingleDomain,
    addDomain
}

