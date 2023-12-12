const Router = require('express')

const controller = require('./controller')
const authMiddleware = require('../shared/authMiddleware')
const roleMiddlewareFactory = require('../shared/roleMiddlewareFactory')

const router = Router()

router.get('/', authMiddleware, controller.getUserChats)
router.get('/test', controller.getPublicKey)

module.exports = router