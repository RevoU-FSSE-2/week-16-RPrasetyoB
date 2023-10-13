import express from 'express';
import 'dotenv/config';
import routes from './routes/main.route';
import { db } from './config/db/db.connection';
import middleWares from './middlewares';
import errorHandler from './middlewares/errorHandler';
import cors from 'cors';
import xRequestId from './middlewares/xRequestId';

const app = express();
const port = process.env.PORT || 3000;

db()
app.use(express.json());
app.use(cors())
middleWares(app)
app.use(xRequestId)
app.use(routes);
app.use(errorHandler);


app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`);
});