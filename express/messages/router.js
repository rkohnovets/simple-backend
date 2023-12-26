const Router = require('express')

const controller = require('./controller')
const authMiddleware = require('../shared/authMiddleware')
const roleMiddlewareFactory = require('../shared/roleMiddlewareFactory')

const router = Router()

router.get('/:chatId', authMiddleware, controller.getMessages)
router.post('/:chatId', authMiddleware, controller.createMessage)
//router.delete('/:messageId', authMiddleware, controller.publickey)

module.exports = router