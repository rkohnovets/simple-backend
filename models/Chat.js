const { Schema, model } = require('mongoose')

// 'NOTES' 'TWOPERSONS' 'MULTI'
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
    leftOn: { type: Date },
    roles: [{ type: Schema.Types.ObjectId, ref: ChatRole, required: true }]
})
//const ChatUser = model('ChatUser', ChatUserSchema)

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
//const ChatSetting = model('ChatSetting', ChatSettingSchema)

const ChatSchema = new Schema({
    // _id mongodb сгенерирует автоматически
    name:   { type: String },
    about:  { type: String },
    type:   { type: Schema.Types.ObjectId, ref: ChatType, required: true },
    //users: [{ type: Schema.Types.ObjectId, ref: ChatUser, required: true, unique: true }],
    users:  [ ChatUserSchema ],
    //settings: [{ type: Schema.Types.ObjectId, ref: ChatSetting, unique: true }],
    settings: [ ChatSettingSchema ],
    image:  { type: Schema.Types.ObjectId }
})
const Chat = model('Chat', ChatSchema)

const onStartup = async () => {
    // 1) типы чатов
    let personalChatType = await ChatType.findOne({ name: 'NOTES' })
    if(!personalChatType) {
        personalChatType = new ChatType({ name: 'NOTES' })
        await personalChatType.save()
    }
    let twoPersonsChatType = await ChatType.findOne({ name: 'TWOPERSONS' })
    if(!twoPersonsChatType) {
        twoPersonsChatType = new ChatType({ name: 'TWOPERSONS' })
        await twoPersonsChatType.save()
    }
    let multiChatType = await ChatType.findOne({ name: 'MULTI' })
    if(!multiChatType) {
        multiChatType = new ChatType({ name: 'MULTI' })
        await multiChatType.save()
    }
    // 2) роли пользователей в чатах
    let commonChatRole = await ChatRole.findOne({ name: 'COMMON' })
    if(!commonChatRole) {
        commonChatRole = new ChatRole({ name: 'COMMON' })
        await commonChatRole.save()
    }
    let moderatorChatRole = await ChatRole.findOne({ name: 'MODERATOR' })
    if(!moderatorChatRole) {
        moderatorChatRole = new ChatRole({ name: 'MODERATOR' })
        await moderatorChatRole.save()
    }
    let adminChatRole = await ChatRole.findOne({ name: 'ADMIN' })
    if(!adminChatRole) {
        adminChatRole = new ChatRole({ name: 'ADMIN' })
        await adminChatRole.save()
    }
    // 3) TODO: ChatSettingType - настройки чата, например:
    // - чтобы приглашать в чат могли не все (а только модераторы или админы)
    // - чтобы пользователи не могли выйти из чата (например чат с заметками, или личная переписка с человеком)
    // - и так далее...
    // Можно изначально некоторые из них применять к чату,
    // чтобы пользователь не мог сделать с чатом то, что не предполагается
    // А некоторые можно дать возможность устанавливать на чат администратору (кастомизировать свой чат)
}

const getChatRole = async (name) => {
    const chatRole = await ChatRole.findOne({ name: name })
    if(!chatRole)
        throw `Ошибка: запрошена, но не найдена роль '${name}'`
    return chatRole
}

const getChatType = async (name) => {
    const chatType = await ChatType.findOne({ name: name })
    if(!chatType)
        throw `Ошибка: запрошен, но не найден тип чата '${name}'`
    return chatType
}

const createNotesChat = async (userId) => {
    const notesChatType = await getChatType('NOTES')

    // 1) такой фильтр работает
    const sameChat = await Chat.findOne({
        type: notesChatType,
        'users.user': userId
    })
    if(sameChat)
        throw `Ошибка: у пользователя c id '${userId}' уже есть чат NOTES (чат для записей)`

    const adminRole = await getChatRole('ADMIN')
    const chatUser = {
        user: userId,
        roles: [ adminRole ]
    }

    const chat = new Chat({
        name: 'Notes',
        type: notesChatType,
        users: [ chatUser ]
    })
    await chat.save()

    return chat
}

const createTwoPersonsChat = async (user1Id, user2Id) => {
    const twoPersonsChatType = await getChatType('TWOPERSONS')

    const usersIds = [ user1Id, user2Id ].sort()

    const sameChat = await Chat.findOne({
        type: twoPersonsChatType,
        'users.0.user': usersIds[0],
        'users.1.user': usersIds[1]
    })
    if(sameChat)
        throw `Ошибка: у пользователей c id '${user1Id}' и '${user2Id}' уже есть чат`

    const adminRole = await getChatRole('ADMIN')
    const chatUsers = usersIds.map(id => ({
        user: id,
        roles: [ adminRole ]
    }))

    const chat = new Chat({
        type: twoPersonsChatType,
        users: chatUsers
    })
    await chat.save()

    return chat
}

const createMultiChat = async (userId, name) => {
    const multiChatType = await getChatType('MULTI')

    const adminRole = await getChatRole('ADMIN')
    const chatUser = {
        user: userId,
        roles: [ adminRole ]
    }

    const chat = new Chat({
        name: name,
        type: multiChatType,
        users: [ chatUser ]
    })
    await chat.save()

    return chat
}

module.exports = {
    onStartup,
    createNotesChat,
    createTwoPersonsChat,
    createMultiChat,
    getChatType,
    getChatRole,
    ChatType,
    ChatRole,
    Chat
}