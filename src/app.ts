import express from 'express';
import 'dotenv/config';
import routes from './routes/main.route';
import { db } from './config/db/db.connection';
import swaggerUi from 'swagger-ui-express';
import * as OpenApiValidator from 'express-openapi-validator'
import fs from 'fs';
import yaml from 'yaml';
import middleWares from './middlewares';
import errorHandler from './middlewares/errorHandler';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

db()
app.use(express.json());
app.use(cors())
middleWares(app)
app.use(routes);
app.use(errorHandler);


app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`);
});

const openApiPath = 'api-doc.yaml';
const readApiFile = fs.readFileSync(openApiPath, 'utf8');
const swaggerDoc = yaml.parse(readApiFile) as object;

app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use(
  OpenApiValidator.middleware({
    apiSpec: openApiPath,
    validateRequests: true
  }),
);