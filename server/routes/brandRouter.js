const Router = require('express')
const brandController = require('../controllers/BrandController')
const router = new Router()
const auth = require('../middleware/authMiddleware')
router.post('/',auth,brandController.create)
router.get('/',brandController.getAll)
router.get('/:id',brandController.getSingleBrand)



module.exports = router