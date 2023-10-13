import helmetApp from "./helmet";
import morganApp from "./morgan";
import { Express } from "express";
import cookieMidleware from "./cookiesParser";

const middleWares = (app: Express)=> {
    helmetApp(app);
    morganApp(app);
    cookieMidleware(app)
}

export default middleWares