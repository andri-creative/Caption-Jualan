// const apiKey = ''
// const url = 'https://openrouter.ai/api/v1'

// const models = ''
// "models?output_modalities=text"
// "/chat/completions"

// module.exports = { apiKey, url, models }


const urlAi = process.env.API_URL
const key = process.env.KEY


module.exports = { urlAi, key }