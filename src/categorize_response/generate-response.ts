import * as credentials from '../public/credentials.json'
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(credentials.geminiApiKey.api_key)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

export async function generateResponse(email: string, category: string) {
    let prompt = '';

    switch (category) {
        case 'Interested':
            prompt = `Generate a response to this email indicating we are interested and suggest scheduling a demo call:\n\n"${email}"`;
            break;
        case 'Not Interested':
            prompt = `Generate a polite response to this email indicating we are not interested:\n\n"${email}"`;
            break;
        case 'More Information':
            prompt = `Generate a response to this email asking for more information:\n\n"${email}"`;
            break;
        default:
            throw new Error('Unknown category');
    }

    const result = await model.generateContent([prompt])
    return result

}
