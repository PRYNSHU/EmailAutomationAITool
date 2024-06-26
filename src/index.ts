import * as express from 'express'
import * as Cors from 'cors'
import gmailOauth from './oauth/gmail-oauth'
import * as integrateProcess from './Integrate_process'

const PORT = 3000

const app = express()

app.use(Cors({origin: true}))

// for parsing application/json
app.use(express.json())

// for parsing application/xwww-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// gmail auth routes
app.use('/', gmailOauth.router)

// auth middleware for api routes
app.use('/', async (req, res, next) => {
	const authenticated = await gmailOauth.authorize()
        if(!authenticated){
            throw 'No Authenticated'
        }
    next()
})

// gmail api routes
app.use('/get-mail', integrateProcess)

// start the server
app.listen(PORT, () => {
	console.log(`App listening at http://localhost:${PORT}`)
})

module.exports = app