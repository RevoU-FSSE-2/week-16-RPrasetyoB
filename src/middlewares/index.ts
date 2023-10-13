import helmetApp from "./helmet";
import morganApp from "./morgan";
import { Express } from "express";
import xRequestId from "../middlewares/xRequestId";
import cookieMidleware from "./cookiesParser";
// import corsMiddleware from "./cors";

const middleWares = (app: Express)=> {
    helmetApp(app);
    morganApp(app);
    // corsMiddleware(app)
    app.use(xRequestId)      
    cookieMidleware(app)  
}

export default middleWares