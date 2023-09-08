export default interface IDomainAnalysisHistory {
    id: number,
    domain_id: number,
    run_at: number,
    whois_data: string,
    virus_total_data: string,
}