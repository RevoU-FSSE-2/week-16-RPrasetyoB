import helmetApp from "./helmet";
import morganApp from "./morgan";
import { Express } from "express";
import xRequestId from "./xRequestId";
import cookieMidleware from "./cookiesParser";
// import corsMiddleware from "./cors";

const middleWares = (app: Express)=> {
    helmetApp(app);
    morganApp(app);
    // corsMiddleware(app)
    cookieMidleware(app)  
    app.use(xRequestId)      
}

export default middleWares