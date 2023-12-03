import { model, Schema } from "mongoose";

const Chat = require('./Chat')

const UserChatSettingTypeSchema = new Schema({
    // _id mongodb сгенерирует автоматически
    name: { type: String, required: true, unique: true },
    editable: { type: Boolean, required: true },
    validValues: [{ type: String }]
})
const UserChatSettingType = model('UserChatSettingType', UserChatSettingTypeSchema)

const ChatSettingSchema = new Schema({
    // _id mongodb сгенерирует автоматически
    type: { type: Schema.Types.ObjectId, ref: UserChatSettingType, required: true },
    value: { type: String }
})
const ChatSetting = model('ChatSetting', ChatSettingSchema)

const UserChatInfoSchema = new Schema({
    // _id mongodb сгенерирует автоматически
    chat: { type: Schema.Types.ObjectId, ref: Chat, required: true },
    settings: [{ type: Schema.Types.ObjectId, ref: ChatSetting, required: true }],
    group: { type: String },
    readBefore: { type: String, required: true }
})
const UserChatInfo = model('UserChatInfo', UserChatInfoSchema)

const UserChatsSchema = new Schema({
    // _id mongodb сгенерирует автоматически
    user: { type: Schema.Types.ObjectId, required: true, unique: true },
    notes: { type: Schema.Types.ObjectId, ref: UserChatInfo, required: true },
    archived: [{ type: Schema.Types.ObjectId, ref: UserChatInfo, required: true, unique: true }],
    deleted: [{ type: Schema.Types.ObjectId, ref: UserChatInfo, required: true, unique: true }],
    other: [{ type: Schema.Types.ObjectId, ref: UserChatInfo, required: true, unique: true }],
})
const UserChats = model('UserChats', UserChatsSchema)