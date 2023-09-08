import IDomainAnalysisHistory from "../models/domain-analysis-history.model";
import postgresService from "./postgres.service";

const getDomainAnalysisHistory = async (domainId: number):Promise<IDomainAnalysisHistory | null> => {
    const query = `
    SELECT 
        id, 
        domain_id, 
        run_at, 
        whois_data, 
        virus_total_data  
    FROM domains_analysis_history 
    WHERE domain_id = $1
    ORDER BY run_at DESC
    LIMIT 1
    `;
    const params = [domainId];
    const queryResult = await postgresService.query(query, params);
    if (queryResult.length === 0) return null;
    console.log(queryResult[0])
    return formatDomainAnalysisHistory(queryResult[0]);
}

const formatDomainAnalysisHistory = (postgressRow: {[key:string]:any}): IDomainAnalysisHistory => {
    return {
        id: postgressRow["id"],
        domain_id: postgressRow["domain_id"],
        run_at: postgressRow["run_at"],
        whois_data: JSON.parse(postgressRow["whois_data"]),
        virus_total_data: JSON.parse(postgressRow["virus_total_data"])
    }
}

export default {
    getDomainAnalysisHistory
}