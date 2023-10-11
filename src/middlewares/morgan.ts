import { Express } from "express";
import logger from 'morgan';
import fs from 'fs'

const morganApp = (app: Express) => {
    app.use(logger('combined',
    {stream: fs.createWriteStream('./logging.log', {flags: 'a'})}
    ))
    app.use(logger('dev'))
}

export default morganApp