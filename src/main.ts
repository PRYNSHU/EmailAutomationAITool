
const API_URL = "http://localhost:3000"

const SignInButton = document.getElementById('SignInButton')
const SendButton = document.getElementById('SendButton')
const RefreshButton = document.getElementById('RefreshButton')

SignInButton.addEventListener('click', async () => {
    try {
        //API CALLING
        const url = API_URL + "/gmail-oauth"
        const response = await fetch(url)
        const authUrl = await response.text()

        if (authUrl) {
            window.open(authUrl, '_blank')
        } else {
            console.error('Authorization URL not found in the response')
        }

    } catch (error) {
        console.error('Error fetching the response:', error);
    }
})

// pending implementation
RefreshButton.addEventListener('click',async () => {
    try {
        const url = API_URL + "/refresh-mail"
        const response: any = await fetch(url)
    } catch (err) {
        console.log(err)
    }
})


SendButton.addEventListener('click', async () => {
    try {
        //API CALLING
        const url = API_URL + '/get-mail'
        const response = await fetch(url)
        if(response)
            console.log('mail sent successfully')

    } catch (error) {
        console.error('Error fetching the response:', error);
    }
})