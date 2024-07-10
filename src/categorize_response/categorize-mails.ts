import * as credentials from '../public/credentials.json'
import * as express from 'express'
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(credentials.geminiApiKey.api_key)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

const router = express.Router()

export async function categorizeEmails(emails) {

    const categorizedEmails = []

    for (const email of emails) {
        const category = await analyzeEmailContent(email.snippet as string)
        categorizedEmails.push({ email, category });
    }

    return categorizedEmails
}


async function analyzeEmailContent(emailContent: string) {

    const prompt = `Analyze the following email and categorize it as Interested, 
    Not Interested, or More Information and make sure response must be either of the three word exact:\n\n"${emailContent}"`
    
    const result = await model.generateContent([prompt])
    const response = result.response.text()
    
    let category: string

    if (response.includes('Interested')) {
        category = 'Interested';
    } else if (response.includes('Not Interested')) {
        category = 'Not Interested'
    } else {
        category = 'More Information'
    }

    return category;
}
