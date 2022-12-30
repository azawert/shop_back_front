const {Brand} = require("../models/models");

class BrandController {
    async create(req, res) {
        const {name} = req.body;
        const brand = await Brand.create({name})
        return res.json({brand})
    }

    async getAll(req, res) {
        const allBrands = await Brand.findAll()

        return res.json(allBrands);
    }

    async getSingleBrand(req, res) {
        const id = req.params.id
        const singleBrand = await Brand.findOne({where: {id}})
        return res.json(singleBrand)
    }
}

module.exports = new BrandController()