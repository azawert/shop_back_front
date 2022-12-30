const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwtToken = require('jsonwebtoken')
const {User, Basket} = require('../models/models')
const {check} = require("express-validator");

const generateJWT = (id, email, role) => {
    return jwtToken.sign({id, email, role}, process.env.SECRET_KEY, {expiresIn: '24h'})
}

class UserController {
    async registration(req, res) {
        const {email, password, role} = req.body
        if (!email || !password) return res.status(400).json({message: "No credentials"})
        const ifUserExists = await User.findOne({where: {email}})
        if (ifUserExists) return res.status(400).json({message: "User already exists"})

        const hashPassword = await bcrypt.hash(password, 5)
        const newUser = await User.create({email, password: hashPassword, role})
        if (!newUser) return res.status(500).json({message: "Internal problems"})
        const basket = await Basket.create({userId: newUser.id})
        const jwt = generateJWT(newUser.id, newUser.email, newUser.role)
        return res.json({user: newUser, token: jwt})

    }

    async login(req, res) {
        const {email, password} = req.body
        if (!email || !password) return res.status(400).json({message: "No credentials"})
        const user = await User.findOne({where: {email}})
        if (!user) return res.status(404).json({message: 'User not found'})
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) return res.status(400).json({message: "Wrong credentials"})
        let jwt = generateJWT(user.id, user.email, user.role)
        return res.json({token: jwt})
    }

    async check(req, res, next) {
        const token = generateJWT(req.user.id, req.user.email, req.user.role)
        return res.json({token})
    }

    async getAllUser(req, res) {
        const allUsers = await User.findAndCountAll()
        return res.json(allUsers)
    }
}

module.exports = new UserController()