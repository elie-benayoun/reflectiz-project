import { Request, Response } from "express"
import helpers from "../helpers/helpers";
import domainAnalysisService from "../services/domain-analysis.service";

const getDomainAnalysis = async (req: Request, res: Response) => {
    let domain = req?.query?.domain as string;
    
    if (!helpers.validateDomain(domain)) return  res.status(400).json({message: "a valid domain is required"});

    const result = await domainAnalysisService.getDomainAnalysis(domain);

    if(result) return res.status(200).json(result);

    await domainAnalysisService.addDomainAnalysis(domain);

    return res.status(200).json({message: "domain was added to the list for analysis try again in a few minutes"});
}

const createDomainAnalysis = async (req: Request, res: Response) => {

}

export default {
    getDomainAnalysis,
    createDomainAnalysis
}