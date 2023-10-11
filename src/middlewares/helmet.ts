import helmet from "helmet";
import { Express } from "express";


const helmetApp = (app: Express)=> {
    app.use(helmet());
    app.use(helmet.frameguard({ action: 'deny' }))
  }

export default helmetApp