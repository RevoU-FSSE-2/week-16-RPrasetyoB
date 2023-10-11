import helmetApp from "./helmet";
import morganApp from "./morgan";
import { Express } from "express";
import xRequestId from "./xRequestId";

const middleWares = (app: Express)=> {
    helmetApp(app);
    morganApp(app);
    app.use(xRequestId)
}

export default middleWares