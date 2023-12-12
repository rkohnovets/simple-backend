const { exceptionHandler } = require('../shared/exceptionHandler')
const { getPublicKey } = require('../../utils/jwtutils')
const config = require("../../config");
const { getOrCreateUserChats, UserChats } = require('../../models/UserChats')

class controller {
    async getUsersByQuery(request, response) {
        try {
            //const { id, roles } = await request.user
            //const { id, roles, username, name, about } = await request.body
            //const usernameParam = request.params.username
            //const query = request.query.query
            //return response.json(usersByQuery)
        }
        catch (e) {
            exceptionHandler(e, request, response)
        }
    }

    async getPublicKey(request, response) {
        try {
            const result = await getPublicKey()
            return response.json(result)
        }
        catch (e) {
            exceptionHandler(e, request, response)
            //throw e
            console.error(e)
        }
    }

    async getUserChats(request, response) {
        try {
            const { id, roles } = await request.user

            /*
            // наверн эта проверка и не нужна, т.к. полученный JWT валиден
            let response = await fetch(
                config.auth_api_https + 'profile/id/' + id,
                {
                    method: 'GET',
                    // mode:'cors'
                }
            )
            const userExists = response.ok
            if(!userExists)
                throw 'Ошибка: JWT корректный, но пользователь не найден'
            */

            const userChats = await getOrCreateUserChats(id)

            return response.json(userChats)
        }
        catch (e) {
            exceptionHandler(e, request, response)
        }
    }
}

module.exports = new controller()