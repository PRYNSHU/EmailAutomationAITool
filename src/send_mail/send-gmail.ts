import { google } from 'googleapis';
import * as fs from 'fs-extra'
import * as path from 'path'
import gmailOauth from '../oauth/gmail-oauth'

export async function sendGmailResponse(email: string, res: any) {

    let response
    res.response.candidates.forEach(candidate => {
        candidate.content.parts.forEach(part => {
            response = part.text
        })
    })

    const TOKEN_PATH = path.join(__dirname, '../token.json')
    const exists = await fs.exists(TOKEN_PATH)
    const token = exists ? await fs.readFile(TOKEN_PATH, 'utf8') : ''
    
    const oAuth2Client = gmailOauth.getOAuth2Client()
    oAuth2Client.setCredentials(JSON.parse(token))
        google.options({
            auth: oAuth2Client
    })

    const gmail = google.gmail('v1')

    await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw: Buffer.from(
                `To: ${email}\r\nSubject: Re: 'me' \r\n\r\n${response}`
            ).toString('base64'),
        },
    })
}