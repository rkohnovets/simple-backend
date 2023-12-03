const { Schema, model } = require('mongoose')

// 'PERSONAL' 'TWOPERSONS' 'MULTI'
const ChatTypeSchema = new Schema({
    // _id mongodb сгенерирует автоматически
    name: { type: String, required: true, unique: true }
})
const ChatType = model('ChatType', ChatTypeSchema)

// 'COMMON' 'MODERATOR' 'ADMIN'
const ChatRoleSchema = new Schema({
    // _id mongodb сгенерирует автоматически
    name: { type: String, required: true, unique: true }
})
const ChatRole = model('ChatRole', ChatRoleSchema)

const ChatUserSchema = new Schema({
    // _id mongodb сгенерирует автоматически
    user: { type: Schema.Types.ObjectId, required: true },
    leftOn: { type: Date, unique: true },
    roles: [{ type: Schema.Types.ObjectId, ref: ChatRole, required: true }]
})
const ChatUser = model('ChatUser', ChatUserSchema)

const ChatSettingTypeSchema = new Schema({
    // _id mongodb сгенерирует автоматически
    name: { type: String, required: true, unique: true },
    validValues: [{ type: String }]
})
const ChatSettingType = model('ChatSettingType', ChatSettingTypeSchema)

const ChatSettingSchema = new Schema({
    // _id mongodb сгенерирует автоматически
    type: { type: Schema.Types.ObjectId, ref: ChatSettingType, required: true },
    value: { type: String }
})
const ChatSetting = model('ChatSetting', ChatSettingSchema)

const ChatSchema = new Schema({
    // _id mongodb сгенерирует автоматически
    name: { type: String },
    about: { type: String },
    type: { type: Schema.Types.ObjectId, ref: ChatType, required: true },
    users: [{ type: Schema.Types.ObjectId, ref: ChatUser, required: true, unique: true }],
    settings: [{ type: Schema.Types.ObjectId, ref: ChatSetting, unique: true }],
    image: { type: Schema.Types.ObjectId }
})
const Chat = model('Chat', ChatSchema)

module.exports = Chat