import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function TapPage() {
  const router = useRouter()
  const { uid } = router.query
  const [gift, setGift] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!uid) return

    async function fetchGift() {
      try {
        const response = await fetch(`/api/tap?uid=${uid}`)
        const data = await response.json()
        
        if (!response.ok) throw new Error(data.message)
        
        setGift(data.gift)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchGift()
  }, [uid])

  const archiveGift = async () => {
    if (!gift) return

    try {
      // Add to user's archived gifts
      const { error } = await supabase
        .from('archived_gifts')
        .insert([
          {
            gift_id: gift.id,
            user_id: uid,
            archived_at: new Date().toISOString()
          }
        ])

      if (error) throw error

      // Store in local storage for offline access
      const savedGifts = JSON.parse(localStorage.getItem('soulr_saved_gifts') || '[]')
      savedGifts.push({
        ...gift,
        timestamp: new Date().toISOString()
      })
      localStorage.setItem('soulr_saved_gifts', JSON.stringify(savedGifts))

      router.push('/archive')
    } catch (err) {
      console.error('Error archiving gift:', err)
      alert('Failed to archive gift')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading your gift...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-pink-900/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white/10 backdrop-blur-md rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-4">You received a gift! ✨</h1>
          
          {gift && (
            <div className="space-y-4">
              {gift.type === 'meme' && (
                <img src={gift.url} alt="Meme" className="w-full rounded-lg" />
              )}
              
              {gift.type === 'song' && (
                <div>
                  <h3 className="font-medium">🎵 {gift.title}</h3>
                  {gift.link && (
                    <a 
                      href={gift.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:text-blue-200 text-sm"
                    >
                      Listen here
                    </a>
                  )}
                </div>
              )}
              
              {['advice', 'quote', 'recommend'].includes(gift.type) && (
                <p className="text-lg">{gift.content}</p>
              )}
              
              {gift.type === 'link' && (
                <div>
                  <a 
                    href={gift.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-300 hover:text-blue-200"
                  >
                    {gift.caption || gift.url}
                  </a>
                </div>
              )}
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => router.push('/')}
                  className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={archiveGift}
                  className="px-4 py-2 rounded-lg bg-purple-500/80 hover:bg-purple-600/80 transition-colors"
                >
                  Save to Archive
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
