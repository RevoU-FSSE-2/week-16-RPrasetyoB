import express from 'express';
import 'dotenv/config';
import routes from './routes/main.route';
import { db } from './config/db/db.connection';
import middleWares from './middlewares';
import errorHandler from './middlewares/errorHandler';
import cors from 'cors';
import checkTokenCookie from './middlewares/checkAccess';
import authRoute  from './routes/authRoute';

const app = express();
const port = process.env.PORT || 3000;

db()
app.use(express.json());
app.use(cors())
middleWares(app)
app.use(authRoute)
app.use(checkTokenCookie)
app.use(routes);
app.use(errorHandler);


app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`);
});