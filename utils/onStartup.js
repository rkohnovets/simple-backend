const {
    onStartup : chatOnStartup,
    createNotesChat,
    createTwoPersonsChat,
    ChatType,
    ChatRole,
    Chat
} = require('../models/Chat')


// стандартные пользователи и роли
const onStartup = async () => {
    await chatOnStartup()

}

module.exports = onStartup