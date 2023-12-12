const { Schema, model } = require('mongoose')

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
            await messageType1.save()
        }
    }
}

const createTextMessage = async (userId, chatId, text) => {
    if(text.length > 1000)
        throw 'USERMESSAGE В вообщении должно быть до 1000 символов'

    const chat = await Chat.findById(chatId)
    if(!chat)
        throw 'USERMESSAGE Данный чат не найден'

    let userInUsersList = false
    for(const chatUser of chat.users) {
        if(chatUser.user === userId && !chatUser.leftOn) {
            userInUsersList = true
            break
        }
    }
    if(!userInUsersList)
        throw 'USERMESSAGE Вы не состоите в этом чате'

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
}

const getMessages = async (userId, chatId, pageSize = 20, pageNumber = 1) => {
    // 1
    /*
    MyModel.find({})
        .sort({ createdAt: -1 })
        .skip(pageSize * (pageNumber - 1))
        .limit(pageSize)
        .exec((err, items) => {
            if (err) {
                // handle error
            }
            MyModel.countDocuments().exec((countError, count) => {
                if (countError) {
                    // handle error
                }
                const totalPages = Math.ceil(count / pageSize);
                res.json({
                    items,
                    totalPages,
                    currentPage: pageNumber,
                });
            });
        });
    */

    // 2
    /*
    MyModel.aggregate([
        { $sort: { createdAt: -1 } },
        { $skip: pageSize * (pageNumber - 1) },
        { $limit: pageSize },
        { $group: { _id: null, count: { $sum: 1 }, items: { $push: "$$ROOT" } } },
    ]).exec((err, results) => {
        if (err) {
            // handle error
        }
        const { count, items } = results[0];
        const totalPages = Math.ceil(count / pageSize);
        res.json({
            items,
            totalPages,
            currentPage: pageNumber,
        });
    });
    */

    // второй варик вроде как лучше
    const results = await Message.aggregate([
        { $match: { chat: chatId } },
        { $sort: { date: -1 } },
        { $skip: pageSize * (pageNumber - 1) },
        { $limit: pageSize },
        { $group: { _id: null, count: { $sum: 1 }, items: { $push: "$$ROOT" } } },
    ]).exec((err, results) => {
        if (err) {
            throw `Ошибка при получении сообщений ${err}`
        }
        const { count, items } = results[0]
        const totalPages = Math.ceil(count / pageSize)
        return {
            items,
            totalPages,
            currentPage: pageNumber,
        }
    })

    return results
}

module.exports = {
    Message,
    MessageType,
    onStartup,
    getMessages
}