import { Request, Response, NextFunction} from "express"
import apiRequestService from "../services/api-request.service";

export default async function (req: Request, res: Response, next: NextFunction) {
    await apiRequestService.addApiRequestHistory(req.method, req.path, JSON.stringify(req.query || {}), JSON.stringify(req.body || {}), req.ip);
    next();
}