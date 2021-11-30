const express = require('express')
const app = express()
const axios = require('axios')
const redis = require('redis')
const responseTime = require('response-time')

redis.createClient({
    host: 'localhost',
    port: 6379
})

app.set('port', process.env.PORT || 3000)

app.use(express.json())
app.use(responseTime())

app.get('/character', async (req, res) => {
    const url = "https://rickandmortyapi.com/api/character"
    const character = await axios(url)
    res.json({success: true, data: character.data})
})

app.all('*', (req, res)=> {
    res.status(404).send('Page Not Found!')
})

app.listen(app.get('port'), () => {
    console.log(`Listen on port ${app.get('port')}`)
})