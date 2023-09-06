import {Router} from "express"
import domainAnalysisController from "../controllers/domain-analysis.controller";

const domainAnalysisRoutes:Router = Router();

domainAnalysisRoutes.get("/", domainAnalysisController.getDomainAnalysis)
domainAnalysisRoutes.post("/", domainAnalysisController.createDomainAnalysis)

export {domainAnalysisRoutes}