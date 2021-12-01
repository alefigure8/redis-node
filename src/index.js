const express = require('express')
const app = express()
const axios = require('axios')
const redis = require('redis')
const responseTime = require('response-time')
const { json } = require('express')

const client = redis.createClient({
    host: '127.0.0.1',
    port: 6379
})
client.connect()
client.on('ready', () => {
    console.log('Redis is connected');
})

app.set('port', process.env.PORT || 3000)

app.use(express.json())
app.use(responseTime())

app.get('/character', async (req, res) => {
    if (!client.get('characters')){
        const url = "https://rickandmortyapi.com/api/character"
        const character = await axios(url)
        client.set('characters', JSON.stringify(character.data))
            .then(() => {
                return res.status(200).json({success: true, data: character.data})
            })
            .catch(err => console.log(err))
    } else {
        client.get('characters')
            .then(response => {
                return res.json({succes: true, data: JSON.parse(response)})
            })
            .catch(err => console.log(err))

    }
})

app.all('*', (req, res)=> {
    res.status(404).send('Page Not Found!')
})

app.listen(app.get('port'), () => {
    console.log(`Listen on port ${app.get('port')}`)
})