import { Request, Response, NextFunction} from 'express'
import { JWT_Sign } from '../config/auth/jwt'
import jwt from "jsonwebtoken"

const authRole = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    
    if (!authHeader) {
      res.status(401).json({ error: 'Unauthorized' })
    } else {
      const token = authHeader.split(' ')[1]      
      try {
        const decodedToken = jwt.verify(token, JWT_Sign) as {userId: string; role: string} ;
        (req as any).role = decodedToken.role;

        if (decodedToken.role === 'manager' || decodedToken.role === 'employee') {
          next()
        } else {
          res.status(401).json({ error: 'Unauthorized' })
        }
      } catch (error) {
        console.log('Error updating user:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while get authorize'
        });
      }
    }
  }

const managerAuth = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    
    if (!authHeader) {
      res.status(401).json({ error: 'Unauthorized' })
    } else {
      const token = authHeader.split(' ')[1]
      
      try {
        const decodedToken : any  = jwt.verify(token, JWT_Sign)    
        if (decodedToken.role === 'manager') {
          next()
        } else {
          res.status(401).json({ error: 'Unauthorized' })
        }
      } catch (error) {
        console.log('Error updating user:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while get authorize'
        });
      }
    }
  }


export { authRole, managerAuth }