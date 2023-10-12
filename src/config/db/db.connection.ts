import { Application } from 'express';
import dbConfig from './db.config';
import mongoose from 'mongoose';

// DB Local
// mongoose.connect('mongodb://127.0.0.1:27017/week10',
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   } as mongoose.ConnectOptions
// );

// DB Atlas
mongoose.connect(`mongodb+srv://${dbConfig.username}:${dbConfig.password}@${dbConfig.cluster}.mongodb.net/${dbConfig.dbname}?retryWrites=true&w=majority`, 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  } as mongoose.ConnectOptions
);

const dbConnect = mongoose.connection;
export const db = () => {
    dbConnect.on('error', console.error.bind(console, 'connection error: '));
    dbConnect.once('open', function () {
    console.log('Connected to database');
  });
}