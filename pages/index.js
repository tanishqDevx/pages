import { useState, useEffect } from 'react'

export default function Home() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState(null)
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [stars, setStars] = useState([])

  // Generate animated starfield
  useEffect(() => {
    const generateStars = () => {
      return Array.from({ length: 150 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 3 + 1,
      }))
    }
    setStars(generateStars())
  }, [])

  async function handleAsk(e) {
    e?.preventDefault()
    if (!question.trim()) return
    setLoading(true)
    setAnswer(null)
    setImage(null)
    setError(null)

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'API error')
      }

      const data = await res.json()
      setAnswer(data.answer || 'No answer returned')
      if (data.apod && data.apod.url) setImage(data.apod)
    } catch (err) {
      setError(err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      {/* Animated Starfield */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDuration: `${star.twinkleSpeed}s`,
            }}
          />
        ))}
      </div>

      {/* Enhanced Dark Space Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-slate-800/10 to-cyan-600/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-slate-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Subtle shooting star effect */}
      <div className="absolute top-1/3 left-0 w-1 h-1 bg-blue-200 rounded-full opacity-60 animate-ping" style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/2 right-0 w-1 h-1 bg-cyan-200 rounded-full opacity-60 animate-ping" style={{ animationDelay: '5s' }} />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          {/* Main Container with Glassmorphism */}
          <div className="backdrop-blur-xl bg-gray-900/40 rounded-3xl p-8 border border-gray-700/50 shadow-2xl relative overflow-hidden">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-800/20 to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <header className="mb-8 text-center">
                <div className="mb-4">
                  <h1 className="text-7xl font-black bg-gradient-to-r from-slate-200 via-blue-300 to-cyan-300 bg-clip-text text-transparent mb-3 tracking-tight">
                    NebulaQuery
                  </h1>
                  <div className="flex items-center justify-center gap-3 text-xl text-white/90">
                    <span className="animate-bounce" style={{animationDelay: '0s'}}>🌌</span>
                    <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-semibold">
                      Explore • Discover • Wonder
                    </span>
                    <span className="animate-bounce" style={{animationDelay: '0.5s'}}>🔭</span>
                  </div>
                </div>
                <p className="text-white/60 text-base max-w-lg mx-auto leading-relaxed">
                  Your personal gateway to the universe. Ask anything about space, astronomy, black holes, galaxies, and beyond.
                </p>
              </header>

              <div className="space-y-6">
                <div className="relative">
                  <input
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAsk(e)}
                    className="w-full p-6 text-lg rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 placeholder:text-gray-400 text-white outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300"
                    placeholder="What cosmic mysteries would you like to uncover today?"
                    aria-label="Ask about space"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 -z-10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                </div>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleAsk}
                    disabled={loading}
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 disabled:from-gray-800 disabled:to-gray-900 text-white font-semibold shadow-lg hover:shadow-blue-500/20 transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Exploring...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        🔍 Query the Nebula
                      </div>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setQuestion(''); setAnswer(null); setImage(null); setError(null) }}
                    className="px-6 py-4 rounded-xl border border-gray-600/50 text-white hover:bg-gray-800/50 transition-all duration-300 font-semibold"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Results Section */}
              <div className="mt-8 space-y-6">
                {error && (
                  <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200">
                    <div className="flex items-center gap-2">
                      <span>❌</span>
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                {answer && (
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-600/40 shadow-xl">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">🌌</span>
                      <h2 className="text-xl font-bold text-white">Cosmic Answer</h2>
                    </div>
                    <div className="text-white/90 leading-relaxed whitespace-pre-wrap">
                      {answer}
                    </div>
                  </div>
                )}

                {image && (
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-600/40 shadow-xl">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">📸</span>
                      <h3 className="text-xl font-bold text-white">NASA Astronomy Picture</h3>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-blue-300 mb-1">{image.title}</h4>
                      <p className="text-white/60 text-sm">{image.date}</p>
                    </div>

                    {image.media_type === 'image' ? (
                      <div className="relative rounded-xl overflow-hidden mb-4 group">
                        <img 
                          src={image.url} 
                          alt={image.title} 
                          className="w-full max-h-96 object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    ) : (
                      <div className="mb-4 p-4 border border-white/20 rounded-xl">
                        <a 
                          href={image.url} 
                          target="_blank" 
                          rel="noreferrer noopener" 
                          className="text-blue-400 hover:text-blue-300 underline transition-colors"
                        >
                          🎥 Open Video/Media
                        </a>
                      </div>
                    )}

                    {image.explanation && (
                      <div className="text-sm text-white/75 leading-relaxed p-4 bg-gray-800/30 rounded-xl border border-gray-600/30">
                        <strong className="text-white/90">Explanation:</strong> {image.explanation}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <footer className="mt-8 pt-6 border-t border-gray-600/30 text-center">
                <div className="flex items-center justify-center gap-4 text-white/40 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                    AI-Powered
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></span>
                    NASA Data
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></span>
                    Real-time
                  </span>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
