import cookieParser from "cookie-parser"
import {Express} from "express"


const cookieMidleware = (app : Express) => {
    app.use(cookieParser())
}

export default cookieMidleware