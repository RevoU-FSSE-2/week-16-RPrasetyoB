import { userModel } from '../config/schemas/schema';
import bcrypt from 'bcrypt'
import { addDays } from "date-fns";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_Sign } from '../config/auth/jwt';;
import NodeCache from 'node-cache';
import ErrorCatch from '../reusable/errorCatch';
import { v4 } from 'uuid';

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
    username: string;
    role: string;
}

const failedLogins = new NodeCache({ stdTTL: 20 }) as any
const cache = new NodeCache({ stdTTL: 20 }) as any;

//------ login ------
const loginUser = async ({username, password}: LoginInput) => {
    try {
    const user = await userModel.findOne({ username })
    const loginAttempts = failedLogins.get(username) || 0
    console.log('loginAttempts',loginAttempts)

        if(loginAttempts >= 4) {
            throw new ErrorCatch({
                success: false,
                message: 'Too many failed login attempts. please try again later',
                status: 429
            })
        }  
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
            const accessTokenExpired = addDays(new Date(), 1)
            const accessToken = jwt.sign(
                {
                    username: user.username,
                    id: user._id,
                    role: user.role
                }, JWT_Sign, {expiresIn: '24h'}
            );
            const refreshTokenPayload : JwtPayload = {
                username: user.username,
                id: user._id,
                role: user.role,
            };
            const refreshToken = jwt.sign(refreshTokenPayload, JWT_Sign, {
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
const updateRole = async ({ username, role }: UserRole) => {
    try {
      const response = await userModel.findOneAndUpdate(
        { username: username },
        { role: role },
        { new: true }
      );  
      if (response) {
        return {          
          success: true,
          message: response
        };
      } else {
        throw new Error("User not found");
      }
    } catch (error: any) {
      console.log(error);
      throw new ErrorCatch({
        success: false,
        message: error.message,
        status: error.status,
      });
    }
  };


//------ password reset request ------
const sendEmail = (email: string, key: string) => {
    console.log(`Subject: Password reset request`);
    console.log(`To: ${email}`);
    console.log(`${key}`);
    // const linkReset = `https://week-16-rprasetyob-production.up.railway.app/reset?key=${key}  
  };
const passResetReq = async (email : string) => {
    try {
        const user = await userModel.findOne({email:email});
        if(!user) {
            throw new ErrorCatch({
                success: false,
                message: 'Email not registered',
                status: 404,
            })
        }
        const key = v4()
        cache.set(key, email, 25 * 1000)
        sendEmail(user.email, key)
        const linkReset = `${key}`
        // const linkReset = `https://week-16-rprasetyob-production.up.railway.app/reset?key=${key}`
        return {
            success: true,
            message: "Password reset link sent",
            data: linkReset
        }        
    } catch (error : any) {
        throw new ErrorCatch({
            success: false,
            message: error.message,
            status: error.status,
        })
    }
}

const passwordReset = async (key: string, password: string) => {
    try {
        const email = cache.get(key);
        if(!email) {
            throw new ErrorCatch({
                success: false,
                status: 401,
                message: "Invalid or expired token",
            })
        }
        const user = await userModel.findOne({ email: email });
        if(!user) {
            throw new ErrorCatch({
                success: false,
                message: 'Email invalid / not registered',
                status: 401,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await user.updateOne({ password: hashedPassword });
    
        cache.del(key);
        return {
            success: true,
            message: 'Password reset successful',
        };
    } catch (error : any) {
        throw new ErrorCatch({
            success: false,
            message: error.message,
            status: error.status,
        })
    }
}


//------- RefreshToken -------
const refreshAccessToken = async (refreshToken: string) => {
    try {
      const user = jwt.verify(refreshToken, JWT_Sign);
      const accessToken = jwt.sign({ user }, JWT_Sign, { expiresIn: '15m' });
  
      return accessToken;
    } catch (error : any) {
        throw new ErrorCatch({
            success: false,
            message: error.message,
            status: error.status,
        })
    }
  }


export { loginUser, registerUser, updateRole, passResetReq, passwordReset, refreshAccessToken}