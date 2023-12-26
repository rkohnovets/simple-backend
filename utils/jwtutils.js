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

const verifyToken = async (token) => {
    const publicKey = await getPublicKey()
    try {
        return jwt.verify(
            token,
            publicKey,
            { algorithm: 'RS256' }
        );
    } catch (err) {
        throw err
    }
}

module.exports = {
    getPublicKey,
    verifyToken
}