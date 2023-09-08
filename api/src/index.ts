import express, {Express} from 'express';
import { domainAnalysisRoutes } from './routes/domain-analysis.route';
import saveApiRequest from './middleware/save-api-request';

const app:Express = express();

app.use(saveApiRequest);

app.use("/domain-analysis", domainAnalysisRoutes)

//catch all other routes
app.use("*", (req, res) => {
    res.status(404).json({message: "route not found"})
})

//catch errors
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({message: "internal server error"})
})


app.listen(8080, () => {
    console.log("Server started on port 8080");
})
