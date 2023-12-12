const { User, userGetting, userValidation, formUserInfoToSend } = require('../../models/User')
const Role = require('../../models/Role')
const { exceptionHandler } = require('../shared/exceptionHandler')

class controller {
    async getUsersByQuery(request, response) {
        try {
            const { id, roles, username, name, about } = await request.body
            const usernameParam = request.params.username
            const query = request.query.query
            return response.json(usersByQuery)
        }
        catch (e) {
            exceptionHandler(e, request, response)
        }
    }
}

module.exports = new controller()