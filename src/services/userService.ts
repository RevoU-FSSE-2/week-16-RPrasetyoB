import { userModel } from '../config/schemas/schema';
import bcrypt from 'bcrypt'
import { addDays } from "date-fns";
import { JwtPayload, sign } from 'jsonwebtoken';
import { JWT_Sign } from '../config/auth/jwt';;
import NodeCache from 'node-cache';
import ErrorCatch from '../errors/errorCatch';

interface LoginInput {
    username: string;
    password: string;
}

interface RegisterInput {
    username: string;
    email: string;
    password: string;
}

interface UserRole {
    _id: string;
    role: string;
}

const failedLogins = new NodeCache({ stdTTL: 20 }) as any

//------ login ------
const loginUser = async ({username, password}: LoginInput) => {
    const user = await userModel.findOne({ username })
    const loginAttempts = failedLogins.get(user?.username) || 0
    console.log('loginAttempts',loginAttempts)

    if(loginAttempts >= 4) {
        throw new ErrorCatch({
            success: false,
            message: 'Too many failed login attempts. please try again later',
            status: 429
        })
    }

    try {
        if(!user) {        
            failedLogins.set(username, loginAttempts + 1)
            throw new ErrorCatch({
                success: false,
                message: 'Username or Password invalid',
                status: 401
            })
        }
        
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (isPasswordCorrect) {
            if(!JWT_Sign) throw new Error('JWT_SIGN is not defined')
            const accessTokenExpired = addDays(new Date(), 1)
            const accessToken = sign(
                {
                    username: user.username,
                    id: user._id,
                    role: user.role
                }, JWT_Sign, {expiresIn: '24'}
            );
            const refreshTokenPayload : JwtPayload = {
                username: user.username,
                id: user._id,
                role: user.role,
            };
            const refreshToken = sign(refreshTokenPayload, JWT_Sign, {
                expiresIn: '7d',
            })
            await failedLogins.del(username);

            return{
                success: true,
                message: {
                    accessToken,
                    refreshToken,
                    accessTokenExpired
                },
            };
        } else {
            failedLogins.set(username, loginAttempts + 1)
            throw new ErrorCatch({
                success: false,
                message: 'Username or Password invalid',
                status: 401
            })
        }
    } catch (error: any) {
        console.log(error)
        throw new ErrorCatch({
            success: false,
            message: error.message,
            status: error.status
        })
    }
}


//------ register ------
const registerUser = async ({ username, email, password}: RegisterInput) => {
    try {
        if(!username) {
            throw new ErrorCatch({
                success: false,
                message: 'Username cannot be empty',
                status: 400
            })
        }
        if (password.length < 8) {
            throw new ErrorCatch({
                success: false,
                message: 'Password must be at least 8 characters long',
                status: 400
            })
        }
        if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
            throw new ErrorCatch({
                success: false,
                message: 'Password must contain both alphabetic and numeric characters',
                status: 400
            })
        }

        const existUser = await userModel.findOne({ username })
        if(existUser) {
            throw new ErrorCatch({
                success: false,
                message: 'Username already exists',
                status: 409
            })
        }
        const hashedPass = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({ username, email, password: hashedPass });
        console.log('newUser',newUser)
        return {
            success: true,
            message: newUser
        };
    } catch (error: any) {
        console.log(error)
        throw new ErrorCatch({
            success: false,
            message: error.message,
            status: error.status
        })
    }
}

//------ update user role ------
const updateRole = async ({_id, role}: UserRole) => {
    try {
        const response = await userModel.findByIdAndUpdate({_id: _id}, {$addToSet: { role: role}})
        if(response) {
            return {
                success : true,
            }
        }        
    } catch (error: any) {
        console.log(error)
        throw new ErrorCatch({
            success: false,
            message: error.message,
            status: error.status
        })
    }
}

export { loginUser, registerUser, updateRole}