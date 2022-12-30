const uuid = require('uuid')
const path = require('path')
const {Device, DeviceInfo, Brand} = require('../models/models')
const ApiError = require('../error/ApiError')

class DeviceController {
    async create(req, res, next) {
        try {
            let {name, price, brandId, typeId, info} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + '.jpg'
            await img.mv(path.resolve(__dirname, '..', 'static', fileName))
            let id = brandId
            let brandName = await Brand.findOne({where: {id}})
            const device = await Device.create({name, price, brandId, typeId, img: fileName})
            if (info) {
                info = JSON.parse(info)
                info.forEach(i => DeviceInfo.create({
                    title: i.title,
                    description: i.description,
                    deviceId: device.id
                }))
            }
            let nameOfBrand = {brandName}
            return res.json({device, info, nameOfBrand})
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async getAll(req, res) {
        try {
            let {brandId, typeId, limit, page} = req.query
            page = page || 1;
            limit = limit || 9;
            let offset = page * limit - limit
            let devices;
            let brandName
            if (!brandId && !typeId) {
                devices = await Device.findAndCountAll({limit, offset})
            }
            if (brandId && !typeId) {
                devices = await Device.findAndCountAll({where: {brandId}, limit, offset})
            }
            if (!brandId && typeId) {
                devices = await Device.findAndCountAll({where: {typeId}, limit, offset})
            }
            if (brandId && typeId) {
                devices = await Device.findAndCountAll({where: {typeId, brandId}, limit, offset})
            }
            return res.json(devices)

        } catch (e) {
            console.log(e)
            return res.status(500).json(e)
        }
    }

    async getSingle(req, res, next) {
        const {id} = req.params

        const deviceById = await Device.findOne({
            where: {id},
            include: [{model: DeviceInfo, as: 'info'}]
        })
        if (!deviceById) return res.json({})
        return res.json(deviceById);
    }

    async findBrandById(req, res) {

    }
    async updateRating(req, res) {
        const {rating,deviceId} = req.body
        const device = await Device.findOne({where:{id:deviceId}})
        if(!device) return res.status(404).json({message:'Device not found! Try again later'})
        device.rating = rating
        await device.save()
        return res.json({message:'success',device})
    }
}

module.exports = new DeviceController()