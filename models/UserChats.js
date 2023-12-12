const { Schema, model } = require('mongoose')

const {
    onStartup,
    createNotesChat,
    createTwoPersonsChat,
    createMultiChat,
    ChatType,
    ChatRole,
    Chat
} = require('./Chat')

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
//const ChatSetting = model('ChatSetting', ChatSettingSchema)

const UserChatInfoSchema = new Schema({
    // _id mongodb сгенерирует автоматически
    chat: { type: Schema.Types.ObjectId, ref: Chat, required: true },
    //settings: [{ type: Schema.Types.ObjectId, ref: ChatSetting, required: true }],
    settings: [ChatSettingSchema],
    group: { type: String },
    readBefore: { type: Date, required: true }
})
//const UserChatInfo = model('UserChatInfo', UserChatInfoSchema)

const UserChatsSchema = new Schema({
    // _id mongodb сгенерирует автоматически
    user: { type: Schema.Types.ObjectId, required: true, unique: true },
    //notes: { type: Schema.Types.ObjectId, ref: UserChatInfo, required: true },
    notes: { type: UserChatInfoSchema, required: true },
    //archived: [{ type: Schema.Types.ObjectId, ref: UserChatInfo, required: true, unique: true }],
    archived: [UserChatInfoSchema],
    //deleted: [{ type: Schema.Types.ObjectId, ref: UserChatInfo, required: true, unique: true }],
    deleted: [UserChatInfoSchema],
    //other: [{ type: Schema.Types.ObjectId, ref: UserChatInfo, required: true, unique: true }],
    other: [UserChatInfoSchema],
})

const getOrCreateUserChats = async (userId) => {
    let userChats = await UserChats.findOne({ user: userId })
    if(userChats)
        return userChats

    const notesChat = await createNotesChat(userId)
    const notesChatInfo = {
        chat: notesChat,
        readBefore: Date.now()
    }

    userChats = new UserChats({
        user: userId,
        notes: notesChatInfo,
        archived: [],
        deleted: [],
        other: []
    })

    await userChats.save()

    return userChats;
}

const UserChats = model('UserChats', UserChatsSchema)

module.exports = {
    UserChats,
    getOrCreateUserChats
}