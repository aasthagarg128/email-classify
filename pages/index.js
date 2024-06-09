import { signIn, signOut, useSession } from 'next-auth/client'
import { useState } from 'react'

export default function Home() {
  const [session, loading] = useSession()
  const [apiKey, setApiKey] = useState('')
  const [emails, setEmails] = useState([])
  const [classifiedEmails, setClassifiedEmails] = useState([])

  const handleFetchEmails = async () => {
    const res = await fetch(`/api/gmail?accessToken=${session.accessToken}`)
    const data = await res.json()
    setEmails(data)
    localStorage.setItem('emails', JSON.stringify(data))
  }

  const handleSaveApiKey = () => {
    localStorage.setItem('openaiKey', apiKey)
  }

  const handleClassifyEmails = async () => {
    const storedEmails = JSON.parse(localStorage.getItem('emails'))
    const openaiKey = localStorage.getItem('openaiKey')

    const res = await fetch('/api/classify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emails: storedEmails, apiKey: openaiKey }),
    })
    const data = await res.json()
    setClassifiedEmails(data)
  }

  return (
    <div className="container mx-auto p-4">
      {!session && (
        <>
          <h1>Not signed in</h1>
          <button onClick={() => signIn('google')} className="bg-blue-500 text-white p-2">Sign in with Google</button>
        </>
      )}
      {session && (
        <>
          <h1>Signed in as {session.user.email}</h1>
          <button onClick={() => signOut()} className="bg-red-500 text-white p-2">Sign out</button>

          <div className="my-4">
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter OpenAI API Key"
              className="border p-2 w-full"
            />
            <button onClick={handleSaveApiKey} className="bg-green-500 text-white p-2 mt-2">Save API Key</button>
          </div>

          <button onClick={handleFetchEmails} className="bg-yellow-500 text-white p-2 mt-2">Fetch Emails</button>
          <button onClick={handleClassifyEmails} className="bg-purple-500 text-white p-2 mt-2">Classify Emails</button>

          <div className="my-4">
            {classifiedEmails.map(email => (
              <div key={email.id} className="border p-2 my-2">
                <h3>{email.classification}</h3>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
