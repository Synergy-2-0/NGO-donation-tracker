import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as userRepo from '../repository/user.repository.js';

export const registerUser = async (data) => {
    const existing = await userRepo.findUserByEmail(data.email);
    if (existing){
         throw new Error('Email already exists');
    }

    const hashed = await bcrypt.hash(data.password, 10);
    return userRepo.createUser({...data, password: hashed});
};

export const loginUser = async (email, password) => {
    const user = await userRepo.findUserByEmail(email);
    if (!user){
        throw new Error('User not found');
    }

    const valid = await bcrypt.compare(password, user.password);
    if(!valid){
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign({
        id: user._id,role: user.role
    },{
        process.env.JWT_SECRET
    },{expiresIn: '1d'});

    return {user,token};
}

