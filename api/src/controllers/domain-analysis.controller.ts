import { Request, Response } from "express"
import helpers from "../helpers/helpers";
import domainsService from "../services/domains.service";
import domainAnlysisHistoryService from "../services/domain-anlysis-history.service";

const getDomainAnalysis = async (req: Request, res: Response) => {
    let domain = req?.query?.domain as string;
    
    if (!helpers.validateDomain(domain)) return  res.status(400).send({message: "a valid domain is required"});

    const domainData = await domainsService.getSingleDomain(domain);

    if(!domainData){
        await domainsService.addDomain(domain);
        return res.status(200).send({message: "domain was added to the list for analysis try again in a few minutes"});
    }

    let domainAnalysisHistory = await domainAnlysisHistoryService.getDomainAnalysisHistory(domainData.id);
    
    if(!domainAnalysisHistory) return res.status(200).send({message: "domain is in the queue for analysis try again in a few minutes"});

    return res.status(200).send(domainAnalysisHistory);
}

const createDomainAnalysis = async (req: Request, res: Response) => {
    let domain = req?.query?.domain as string;
    
    if (!helpers.validateDomain(domain)) return  res.status(400).send({message: "a valid domain is required"});

    const domainData = await domainsService.getSingleDomain(domain);
    
    if(domainData) return res.status(400).send({message: "domain was previously added to the list for analysis"});

    await domainsService.addDomain(domain);
    return res.status(200).send({message: "domain was added to the list for analysis"});
}

export default {
    getDomainAnalysis,
    createDomainAnalysis
}