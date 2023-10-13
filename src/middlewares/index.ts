import helmetApp from "./helmet";
import morganApp from "./morgan";
import { Express } from "express";
import cookieMidleware from "./cookiesParser";
import { xRequestId } from "./xRequestId";
// import corsMiddleware from "./cors";

const middleWares = (app: Express)=> {
    helmetApp(app);
    morganApp(app);
    // corsMiddleware(app)
    app.use(xRequestId)      
    cookieMidleware(app)  
}

export default middleWares