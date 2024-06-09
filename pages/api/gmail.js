import { google } from 'googleapis'

export default async function handler(req, res) {
  const { accessToken } = req.query

  if (!accessToken) {
    res.status(400).json({ error: 'Access token missing' })
    return
  }

  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: accessToken })

  const gmail = google.gmail({ version: 'v1', auth })

  const response = await gmail.users.messages.list({
    userId: 'me',
    maxResults: 10,
  })

  const messages = await Promise.all(response.data.messages.map(async message => {
    const msg = await gmail.users.messages.get({ userId: 'me', id: message.id })
    return msg.data
  }))

  res.status(200).json(messages)
}
