const { exceptionHandler } = require('../shared/exceptionHandler')
const { getPublicKey } = require('../../utils/jwtutils')
const config = require("../../config");
const { getOrCreateUserChats, UserChats } = require('../../models/UserChats')
const { Chat, createTwoPersonsChat, ChatType, getChatType } = require("../../models/Chat");

const fetchUser = async (id) => {
    let response = await fetch(config.auth_api_https + '/profile/id/' + id, {
        method: 'GET',
        mode: 'cors'
    })

    if(response.ok) {
        const user = await response.json()
        return user
    } else {
        let text = await response.text()
        throw `Ошибка при попытке получить информацию о пользователе по id: ${text}`
    }
}

class controller {
    async getPublicKey(request, response) {
        try {
            const result = await getPublicKey()
            return response.json(result)
        }
        catch (e) {
            exceptionHandler(e, request, response)
            console.error(e)
        }
    }

    async getUserChats(request, response) {
        try {
            const { id, roles } = await request.user
            
            const userChats = await getOrCreateUserChats(id)

            return response.json(userChats)
        }
        catch (e) {
            exceptionHandler(e, request, response)
        }
    }

    async getChatInfo(request, response) {
        try {
            //const { id, roles } = await request.user

            const idParam = request.params.id
            if(!idParam)
                throw 'USERMESSAGE Не указан id чата'

            const theChat = await Chat
                .findById(idParam)
                .populate('type')
                .populate('users.roles')
                .exec()
            if(!theChat)
                throw 'USERMESSAGE Чат не найден'

            // TODO: проверять имеет ли пользователь право чекать инфу о чате
            // (должен состоять в нем)

            return response.json({
                id: theChat._id,
                name: theChat.name,
                about: theChat.about,
                type: theChat.type.name,
                settings: theChat.settings,
                users: theChat.users
            })
        }
        catch (e) {
            exceptionHandler(e, request, response)
        }
    }

    async createTwoPersonsChat(request, response) {
        try {
            const { id, roles } = await request.user

            const idParam = request.params.id
            if(!idParam)
                throw 'USERMESSAGE Не указан id пользователя, с которым нужно создать чат'

            if(idParam === id)
                throw 'USERMESSAGE Нельзя создать чат с самим собой'

            try {
                const theUser = await fetchUser(idParam)
            }
            catch {
                throw 'USERMESSAGE Пользователя с таким id не существует'
            }

            const usersIds = [ id, idParam ].sort()

            let theChat
            try {
                let twoPersonsChatType = await getChatType('TWOPERSONS')
                theChat = await Chat
                    .findOne({
                        type: twoPersonsChatType,
                        'users.0.user': usersIds[0],
                        'users.1.user': usersIds[1]
                    })
                    .populate('type')
                    .populate('users.roles')
                    .exec()
            } catch (e) {
                console.log(e)
                throw 'USERMESSAGE Неизвестная ошибка'
            }

            if(theChat)
                throw 'USERMESSAGE Данный чат уже существует'

            theChat = await createTwoPersonsChat(id, idParam)

            const userChats1 = await getOrCreateUserChats(id)
            const userChats2 = await getOrCreateUserChats(idParam)
            const createChatInfo = () => ({
                chat: theChat,
                readBefore: Date.now()
            })
            userChats1.other.push(createChatInfo())
            userChats2.other.push(createChatInfo())
            await userChats1.save()
            await userChats2.save()

            return response.json({
                id: theChat._id,
                name: theChat.name,
                about: theChat.about,
                type: theChat.type.name,
                settings: theChat.settings,
                users: theChat.users
            })
        }
        catch (e) {
            exceptionHandler(e, request, response)
        }
    }
}

module.exports = new controller()