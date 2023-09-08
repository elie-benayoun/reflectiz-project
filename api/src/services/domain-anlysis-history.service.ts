import IDomainAnalysisHistory from "../models/domain-analysis-history.model";
import postgresService from "./postgres.service";

/**
 * Get the last domain analysis data avilable for a specific domain id from the table domains_analysis_history
 * @param domainId The domain id to get the analysis
 * @returns the last domain analysis data available for a specific table 
 */
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
    return formatDomainAnalysisHistory(queryResult[0]);
}

const formatDomainAnalysisHistory = (postgressRow: {[key:string]:any}): IDomainAnalysisHistory => {
    return {
        run_at: postgressRow["run_at"],
        whois_data: postgressRow["whois_data"],
        virus_total_data: postgressRow["virus_total_data"]
    }
}

export default {
    getDomainAnalysisHistory
}