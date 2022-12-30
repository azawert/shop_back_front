const Router = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const router = new Router()
const deviceController = require('../controllers/deviceController')
const checkRole = require('../middleware/checkRoleMiddleware')
router.post('/',checkRole('ADMIN'),deviceController.create)
router.get('/',deviceController.getAll)
router.get('/:id',deviceController.getSingle)
router.get('/brandbyid/:id',deviceController.findBrandById)
router.post('/update-rating',authMiddleware,deviceController.updateRating)



module.exports = router