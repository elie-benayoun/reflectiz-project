export default interface IDomainAnalysisHistory {
    id: number,
    domainId: number,
    run_at: number,
    whois_data: string,
    virus_total_data: string,
}