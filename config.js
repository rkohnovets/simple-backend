const fs = require('fs')

const development = true
const port = process.env.PORT || 4000

if(development)
    // хз возникала ошибка self-singed certificate (при запросах к серверу аутентификации),
    // по видимому потому что сервер аутентификации на том же компе,
    // и сертификат на сервере аутентификации сгенерирован тоже локально
    // а эта команда убирает такие проверки
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

// to use https on localhost you can generate your own certificate:
// 1) install openssl
// 2) delete directory 'cert'
// 3) run command 'npm run generate-cert' in terminal
// (some passphrase like '1234' and empty other fields to just generate cert)
const key = fs.readFileSync('./cert/key.pem');
const cert = fs.readFileSync('./cert/cert.pem');

// вообще это нужно как-то из переменных окружения доставать
// или еще как-то, а не прост вписывать, но пока что так
// (да я, где-то на энглише комменты, где-то на русском)
const mongo_user = 'user'
const mongo_pass = '123pass789'
const mongo_cluster_url = 'myfreecluster.ugjdqge.mongodb.net/'
const mongo_conn_str =
    `mongodb+srv://${mongo_user}:${mongo_pass}` +
    `@${mongo_cluster_url}?retryWrites=true&w=majority`;

const auth_api_https = "https://localhost:5000"

module.exports = {
    port,
    mongo_conn_str,
    development,
    auth_api_https,
    key,
    cert
}