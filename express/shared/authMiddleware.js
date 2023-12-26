const jwtutils = require('../../utils/jwtutils')

module.exports = async function (request, response, next) {
    try {
        const jwt = request.headers.authorization
        if(!jwt)
            throw "Не указан JWT в заголовке Authorization"

        // если jwt токен будет невалидный, то бросит исключение
        request.user = await jwtutils.verifyToken(jwt)

        next()
    } catch (e) {
        const devMessage = `Ошибка на этапе аутентификации: ${e}`
        console.log(devMessage)

        const message = '403 - Ошибка на этапе аутентификации'
        response.status(403).json(message)
    }
}