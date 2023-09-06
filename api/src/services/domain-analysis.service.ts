import postgresService from "./postgres.service"

const getDomainAnalysis = async (domain: string):Promise<string | null> => {
    console.log('getDomainAnalysis');
    let query = `SELECT * FROM domains WHERE domain = $1`;
    let params = [domain];
    let queryResult = await postgresService.query(query, params);
    console.log('queryResult');
    console.log(queryResult);
    return 'yo';
}

const addDomainAnalysis = async (domain: string) => {

}

export default {
    getDomainAnalysis,
    addDomainAnalysis
}