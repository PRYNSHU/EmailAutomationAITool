import { google } from 'googleapis'
import * as parseMessage from 'gmail-api-parse-message'
const gmail = google.gmail('v1')

export async function fetchGmailEmails() {
    const response = await gmail.users.messages.list({userId: 'me', maxResults: 1})
    
    const messages = await Promise.all(response.data.messages.map(async message => {
        
        const messageResponse = await getEmail({messageId: message.id})
        return parseMessage(messageResponse)
    }))

    return messages
}

async function getEmail({messageId}) {
    const response = await gmail.users.messages.get({id: messageId, userId: 'me', format: 'full'})
    return response.data
}
