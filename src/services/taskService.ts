import { userModel } from '../config/schemas/schema';
import bcrypt from 'bcrypt'
import { addDays } from "date-fns";
import { JwtPayload, sign } from 'jsonwebtoken';
import { JWT_Sign } from '../config/auth/jwt';;
import NodeCache from 'node-cache';
import ErrorCatch from '../errors/errorCatch';