import { fetchGmailEmails } from './fetch_mails/fetch-gmails';
import { categorizeEmails } from './categorize_response/categorize-mails';
import { generateResponse } from './categorize_response/generate-response';
import { sendGmailResponse } from './send_mail/send-gmail';
import * as express from 'express'

const router = express.Router()

router.get('/', async (req, res) => {

    const data = await processEmails()
    res.send({msg : data})
})

async function processEmails() {

    //fetch emails
    let emails = await fetchGmailEmails()

    //categorize emails
    const categorizedEmails = await categorizeEmails(emails)

    //generate response and send the emails
    for (const { email, category } of categorizedEmails) {
        
        const response = await generateResponse(email, category)
        const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
        const emailId = email.headers.from.match(emailRegex)

        await sendGmailResponse(emailId[0], response)
    }

    return "Mail Successfully sent!!"
}

export = router
