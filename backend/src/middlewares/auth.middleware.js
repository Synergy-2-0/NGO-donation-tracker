import jwt from 'jsonwebtoken';
import {promisify} from 'util';

const verifyJwt = promisify(jwt.verify);

export const protect = async (req, res, next) => {
    try{
        let token; 
        if(req.headers.authorization?.startsWith('Bearer ')){
            token = req.headers.authorization.split(' ')[1];
        }
        if(!token) return res.status(401).json({message: 'Unauthorized'});

        const decoded = await verifyJwt(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(err){
        res.status(401).json({message: 'Invalid token', error: err.message});
    }
};

    export const restrictTo = (...roles) => (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({message: 'Forbidden: insufficient role'});
        }
    
    next();
    };