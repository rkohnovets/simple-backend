const jwt = require('jsonwebtoken')

const config = require('../config')

let publicKey = null
const getPublicKey = async () => {
    if(publicKey)
        return publicKey

    let response = await fetch(
        config.auth_api_https + '/auth/public-key',
        { method: 'GET' }
    )

    if(response.ok) {
        const body = await response.json()
        publicKey = body.publicKey
        return publicKey
    } else {
        throw 'Cannot get public key'
    }
}

const verifyToken = (token) => {
    try {
        return jwt.verify(
            token,
            getPublicKey(),
            {
                algorithm: 'RS256'
            }
        );
    } catch (err) {
        /*
            TODO throw http 500 here
            ! Dont send JWT error messages to the client
            ! Let exception handler handles this error
        */
        throw err
    }
}

module.exports = {
    verifyToken
}