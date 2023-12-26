const Router = require('express')

const controller = require('./controller')
const authMiddleware = require('../shared/authMiddleware')
const roleMiddlewareFactory = require('../shared/roleMiddlewareFactory')

const router = Router()

router.get('/', authMiddleware, controller.getUserChats)
router.get('/test', controller.getPublicKey)
router.get('/:id', authMiddleware, controller.getChatInfo)
router.post('/user/:id', authMiddleware, controller.createTwoPersonsChat)

module.exports = router