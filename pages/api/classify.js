import { Configuration, OpenAIApi } from 'openai'

export default async function handler(req, res) {
  const { emails, apiKey } = req.body

  if (!apiKey) {
    res.status(400).json({ error: 'API key missing' })
    return
  }

  const configuration = new Configuration({
    apiKey,
  })
  const openai = new OpenAIApi(configuration)

  const classifications = await Promise.all(emails.map(async email => {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Classify the following email: "${email.snippet}" into one of the following categories: Important, Promotions, Social, Marketing, Spam, General.`,
      max_tokens: 50,
    })
    return { id: email.id, classification: response.data.choices[0].text.trim() }
  }))

  res.status(200).json(classifications)
}
