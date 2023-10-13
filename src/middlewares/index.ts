import helmetApp from "./helmet";
import morganApp from "./morgan";
import { Express } from "express";
import xRequestId from "./xRequestId";
import cookieMidleware from "./cookiesParser";

const middleWares = (app: Express)=> {
    helmetApp(app);
    morganApp(app);
    cookieMidleware(app)
}

export default middleWares