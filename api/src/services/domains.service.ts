import IDomain from "../models/domain.model";
import postgresService from "./postgres.service"


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
    console.log("Query Result", queryResult[0])
    console.log("Formated Result", formateSingleDomain(queryResult[0]))
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

const addDomain = async (domain:string):Promise<void> => {
    let query = `INSERT INTO domains (domain) VALUES ($1)`;
    let params = [domain];
    await postgresService.query(query, params);
}


export default {
    getSingleDomain,
    addDomain
}

