const {Type} = require('../models/models')
const ApiError = require('../error/ApiError')
class TypeController {
    async create(req,res,next) {
        const {name} = req.body
        if(!name) return next(ApiError.badRequest('No name for type provided'))
        const type = await Type.create({name})
        return res.json({type});
    }
    async getAll(req,res) {
        const type = await Type.findAll()
        res.json({type})
    }
}

module.exports = new TypeController()