import * as express from 'express'
import { google } from 'googleapis'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as credentials from '../credentials.json'

const router = express.Router()

const SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/gmail.send'
]

const TOKEN_PATH = path.join(__dirname, '../token.json')

router.get('/gmail-oauth', async (req, res) => {
	try{
        const authenticated = await authorize()

        // if not authenticated, request new token
        if(!authenticated){
            const authorizeUrl = await getNewToken()
            return res.send(`<script>window.open("${authorizeUrl}", "_blank");</script>`)
        }

        return res.send({msg: 'Authenticated'})
    }catch(e){
        return res.send({error: e})
	}
})


router.get('/oauth-redirect', async (req, res) => {
    try{
        // get authorization code from request
        const code =  req.query.code as string

        const oAuth2Client = getOAuth2Client()
        const result = await oAuth2Client.getToken(code)
        const tokens = result.tokens

		await saveToken(tokens)

        console.log('Successfully authorized')
        return res.send("<script>window.close();</script>")
    }catch(e){
        return res.send({error: e})
    }
})

async function authorize() {

    // check if the token already exists
    const exists = await fs.exists(TOKEN_PATH)
    const token = exists ? await fs.readFile(TOKEN_PATH, 'utf8') : ''

    if(token){
        const oAuth2Client = getOAuth2Client()
        oAuth2Client.setCredentials(JSON.parse(token))
        google.options({
            auth: oAuth2Client
        })
        return true
    }
    
    return false
}

async function getNewToken() {
    const oAuth2Client = getOAuth2Client()

    return oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: SCOPES,
    })
}

const saveToken = async (token) => {
    await fs.writeFile(TOKEN_PATH, JSON.stringify(token))
}

function getOAuth2Client() {
    const GOOGLE_CLIENT_ID = credentials.web.client_id
    const GOOGLE_CLIENT_SECRET = credentials.web.client_secret
    const GOOGLE_REDIRECT_URL = credentials.web.redirect_uris[0]

    const oAuth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL)
    return oAuth2Client
}

export default { router, authorize, getOAuth2Client }