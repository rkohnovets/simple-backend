const { onStartup : chatOnStartup } = require('../models/Chat')
const { onStartup : messageOnStartup } = require('../models/Message')


// стандартные пользователи и роли
const onStartup = async () => {
    await chatOnStartup()
    await messageOnStartup()
}

module.exports = onStartup