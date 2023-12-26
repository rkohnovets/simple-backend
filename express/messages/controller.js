const { getMessages, createTextMessage } = require('../../models/Message')
const { exceptionHandler } = require('../shared/exceptionHandler')

class controller {
    async getMessages(request, response) {
        try {
            const { id, roles } = await request.user
            const chatId = request.params.chatId
            const messages = await getMessages(id, chatId)
            return response.json(messages)
        }
        catch (e) {
            exceptionHandler(e, request, response)
        }
    }

    async createMessage(request, response) {
        try {
            const { id, roles } = request.user
            const chatId = request.params.chatId
            
            const body = await request.body
            if(!body || !body.text)
                throw 'USERMESSAGE Неправильная сигнатура тела запроса'
            
            const message = await createTextMessage(id, chatId, body.text)
            response.json(message)
        }
        catch (e) {
            exceptionHandler(e, request, response)
        }
    }
}

module.exports = new controller()