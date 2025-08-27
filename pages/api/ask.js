// pages/api/ask.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { question } = req.body || {}
  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Missing question (string expected)' })
  }

  // Basic sanitation (trim)
  const userQuestion = question.trim()
  if (!userQuestion) return res.status(400).json({ error: 'Empty question' })

  // Ensure OpenAI key exists
  const OPENAI_KEY = process.env.OPENAI_API_KEY
  if (!OPENAI_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured (OPENAI_API_KEY)' })
  }

  try {
    // Call OpenAI Chat Completions
    const openaiResp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are SpaceQ, a concise and accurate assistant who answers questions about space, astronomy, astrophysics, and related topics for a general audience.' },
          { role: 'user', content: userQuestion }
        ],
        temperature: 0.2,
        max_tokens: 800
      }),
    })

    if (!openaiResp.ok) {
      const errText = await openaiResp.text()
      console.error('OpenAI error:', openaiResp.status, errText)
      return res.status(502).json({ error: 'OpenAI API returned an error' })
    }

    const openaiData = await openaiResp.json()
    const answer = openaiData.choices?.[0]?.message?.content?.trim() || 'No answer returned by the model.'

    // Try to fetch NASA APOD (optional)
    let apod = null
    try {
      const NASA_KEY = process.env.NASA_API_KEY
      if (NASA_KEY) {
        const nasaRes = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`)
        if (nasaRes.ok) {
          apod = await nasaRes.json()
        } else {
          console.warn('NASA API non-OK status', nasaRes.status)
        }
      }
    } catch (err) {
      console.warn('NASA fetch failed:', err?.message)
    }

    return res.status(200).json({ answer, apod })
  } catch (err) {
    console.error('Server error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
