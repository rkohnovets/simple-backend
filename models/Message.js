const { Schema, model, Types } = require('mongoose')

const { Chat } = require('./Chat')

// 'TEXT' 'FILE' 'IMAGE' 'CHATINVITE'
const MessageTypeSchema = new Schema({
    // _id mongodb сгенерирует автоматически
    name: { type: String, required: true, unique: true }
})
const MessageType = model('MessageType', MessageTypeSchema)

const MessageSchema = new Schema({
    // _id mongodb сгенерирует автоматически
    chat: { type: Schema.Types.ObjectId, ref: Chat, required: true },
    sender: { type: Schema.Types.ObjectId, required: true },
    type: { type: Schema.Types.ObjectId, ref: MessageType, required: true },
    date: { type: Date, required: true },
    text: { type: String }, // не обязателен, т. к. может быть не текст
    content: { type: Schema.Types.Mixed } // если тип сообщения не 'TEXT'
})
const Message = model('Message', MessageSchema)

const onStartup = async () => {
    // 1) типы сообщений
    for(const typeName of ['TEXT', 'FILE', 'IMAGE', 'CHATINVITE']) {
        let messageType = await MessageType.findOne({name: typeName})
        if (!messageType) {
            messageType = new MessageType({name: typeName})
            await messageType.save()
        }
    }
}

const createTextMessage = async (userId, chatId, text) => {
    if(text.length > 1000)
        throw 'USERMESSAGE В вообщении должно быть не более 1000 символов'

    const chat = await Chat.findById(chatId)
    if(!chat)
        throw 'USERMESSAGE Данный чат не найден'

    let userInUsersList = false
    for(const chatUser of chat.users) {
        if(chatUser.user.toString() === userId && !chatUser.leftOn) {
            userInUsersList = true
            break
        }
    }
    if(!userInUsersList)
        throw 'USERMESSAGE Вы не состоите в этом чате'
    
    // TODO: проверка - имеет ли пользователь право создавать сообщения

    let messageType = await MessageType.findOne({name: 'TEXT'})

    const message = new Message({
        chat: chat,
        sender: userId,
        type: messageType,
        date: Date.now(),
        text: text,
        content: null
    })

    await message.save()

    return message
}

const getMessages = async (userId, chatId, pageSize = 20, pageNumber = 1) => {
    // TODO: проверка - состоит ли пользователь в чате

    const results = await Message.aggregate([
        { $match: { chat: new Types.ObjectId(chatId) } },
        { $sort: { date: -1 } },
        { $skip: pageSize * (pageNumber - 1) },
        { $limit: pageSize },
        { $group: { _id: null, count: { $sum: 1 }, items: { $push: "$$ROOT" } } },
    ]).exec()

    let { count, items } = results[0] ?? { count: 1, items: [] }

    const messageTypes = await MessageType.find({}).exec()
    const findTypeNameById = (id) => {
        const idStr = id.toString()
        for(const type of messageTypes)
            if(type._id.toString() === idStr)
                return type.name
        return null
    }

    items = items.map(message => {
        let typeName = findTypeNameById(message.type)
        if(!typeName)
            throw `Ошибка: не найден тип сообщения с id ${messageTypeIdStr}`

        return {
            id: message._id,
            chat: message.chat,
            sender: message.sender,
            type: typeName,
            date: message.date,
            text: message.text,
            content: message.content
        }
    })
    
    return {
        items,
        totalPages: Math.ceil(count / pageSize),
        pageNumber,
    }
}

module.exports = {
    Message,
    MessageType,
    onStartup,
    getMessages,
    createTextMessage
}