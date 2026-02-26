import * as userService from '../services/user.service.js';

export const register = async (req,res) => {
    try{
        const user = await userService.registerUser(req.body);
        res.status(201).json(user);
    }catch(err){
        res.status(400).json({message: err.message});
    }
};


export const login = async (req,res) => {
    try{
        const data = await userService.loginUser(req.body.email, req.body.password);
        res.json(data);
    }catch(err){
        res.status(400).json({message: err.message});
    }
};

export const getAll = async (req,res) => {
    const users = await userService.getUsers({});
    res.json(users);
}

export const update = async (req,res) => {
    const user = await userService.updateUser(req.params.id,req.body);
    res.json(user);

};

export const deactivate = async (req,res) => {
    const user = await userService.deactivateUser(req.params.id);
    res.json(user);
};
