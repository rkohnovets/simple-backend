const { Schema, model } = require('mongoose')

const Chat = require('./Chat')

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
    text: { type: String }, // не обязателен, т. к. может быть не текст
    content: { type: Schema.Types.Mixed } // если тип сообщения не 'TEXT'
})
const Message = model('Message', MessageSchema)