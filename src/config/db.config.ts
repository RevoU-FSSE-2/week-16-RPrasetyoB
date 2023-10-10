import dotenv from 'dotenv'

dotenv.config();


const username = process.env.DB_ATLAS_USER;
const password = process.env.DB_ATLAS_PASS;
const cluster = process.env.DB_ATLAS_CLUSTER;
const dbname = process.env.DB_ATLAS_NAME;

const dbConfig = {username, password, cluster, dbname}
export default dbConfig
